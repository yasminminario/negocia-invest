import { useState } from 'react';
import { apiClient, API_ENDPOINTS } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// (no external ABI types needed here)

// Minimal EIP-1193 provider typing (no `any`)
type EIP1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

type BlockchainStatus = {
  deployed?: boolean;
  address?: string | null;
  abi_present?: boolean;
  message?: string;
  error?: string;
  deployer_address?: string | null;
  deployer_present?: boolean;
  onchain?: boolean;
  [key: string]: unknown;
};

const translations: Record<string, Record<string, string>> = {
  pt: {
    title: 'Blockchain — Hardhat & deploys',
    interaction: 'Interação Blockchain',
    view_status: 'Ver status',
    deploy_backend: 'Deploy (backend)',
    abi_json: 'ABI JSON',
    create_user: 'Criar usuário',
    create_test_user: 'Criar usuário de teste',
    creating: 'Criando...',
    deploying: 'Deploying...',
    registrar_label: 'Registrar hash on-chain',
    registrar_help: 'Cole a hash a partir do campo Última tx exibido acima, ou clique em "Usar última tx" para preencher automaticamente o campo.',
    registrar_button: 'Registrar (backend)',
    use_last_tx: 'Usar última tx',
    copy_last_tx: 'Copiar última tx',
    status: 'Status:',
    backend: 'Backend:',
    deployer: 'Deployer (server wallet):',
    last_tx: 'Última tx:',
    onchain_proof: 'On-chain proof',
    contract: 'Contrato:',
    registrador: 'Registrador (indexed):',
    copy_tx: 'Copy TX',
    show_raw: 'Show raw',
    hide_raw: 'Hide',
    compiled_artifact: 'Compiled artifact',
    close: 'Close',
    copy_json: 'Copy JSON',
    create_test_user_note: 'Use o botão abaixo para criar um usuário de teste — o servidor NÃO retorna nem armazena chaves privadas.',
    update_proof: 'Atualizar prova',
    user_created_no_wallet: 'Usuário criado (sem wallet):',
  },
  en: {
    title: 'Blockchain — Hardhat & deploys',
    interaction: 'Blockchain Interaction',
    view_status: 'View status',
    deploy_backend: 'Deploy (backend)',
    abi_json: 'ABI JSON',
    create_user: 'Create user',
    create_test_user: 'Create test user',
    creating: 'Creating...',
    deploying: 'Deploying...',
    registrar_label: 'Register hash on-chain',
    registrar_help: 'Paste the hash from the Last tx field above, or click "Use last tx" to auto-fill the input.',
    registrar_button: 'Register (backend)',
    use_last_tx: 'Use last tx',
    copy_last_tx: 'Copy last tx',
    status: 'Status:',
    backend: 'Backend:',
    deployer: 'Deployer (server wallet):',
    last_tx: 'Last tx:',
    onchain_proof: 'On-chain proof',
    contract: 'Contract:',
    registrador: 'Registrar (indexed):',
    copy_tx: 'Copy TX',
    show_raw: 'Show raw',
    hide_raw: 'Hide',
    compiled_artifact: 'Compiled artifact',
    close: 'Close',
    copy_json: 'Copy JSON',
    create_test_user_note: 'Use the button below to create a test user — the server does NOT return or store private keys.',
    update_proof: 'Refresh proof',
    user_created_no_wallet: 'User created (no wallet):',
  },
  es: {
    title: 'Blockchain — Hardhat & deploys',
    interaction: 'Interacción Blockchain',
    view_status: 'Ver estado',
    deploy_backend: 'Deploy (backend)',
    abi_json: 'ABI JSON',
    create_user: 'Crear usuario',
    create_test_user: 'Crear usuario de prueba',
    creating: 'Creando...',
    deploying: 'Deploying...',
    registrar_label: 'Registrar hash on-chain',
    registrar_help: 'Pegue el hash desde el campo Última tx arriba, o haga clic en "Usar última tx" para rellenar automáticamente.',
    registrar_button: 'Registrar (backend)',
    use_last_tx: 'Usar última tx',
    copy_last_tx: 'Copiar última tx',
    status: 'Estado:',
    backend: 'Backend:',
    deployer: 'Deployer (server wallet):',
    last_tx: 'Última tx:',
    onchain_proof: 'Prueba on-chain',
    contract: 'Contrato:',
    registrador: 'Registrador (indexed):',
    copy_tx: 'Copy TX',
    show_raw: 'Show raw',
    hide_raw: 'Hide',
    compiled_artifact: 'Compiled artifact',
    close: 'Close',
    copy_json: 'Copy JSON',
    create_test_user_note: 'Use el botón abajo para crear un usuario de prueba — el servidor NO devuelve ni almacena claves privadas.',
    update_proof: 'Actualizar prueba',
    user_created_no_wallet: 'Usuario creado (sin wallet):',
  }
};

const Test = () => {
  const [lang, setLang] = useState<'pt'|'en'|'es'>('pt');
  const t = (key: string) => translations[lang][key] ?? key;
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [tx, setTx] = useState<string>('');
  const [lastReceipt, setLastReceipt] = useState<Record<string, unknown> | null>(null);
  const [showRawReceipt, setShowRawReceipt] = useState<boolean>(false);
  const [deploying, setDeploying] = useState<boolean>(false);
  const [compiledArtifact, setCompiledArtifact] = useState<Record<string, unknown> | null>(null);
  const [showCompiled, setShowCompiled] = useState<boolean>(false);
  const [backendDeployedAddress, setBackendDeployedAddress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hashInput, setHashInput] = useState<string>('');
  const [hashError, setHashError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown) => {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get<BlockchainStatus>(API_ENDPOINTS.blockchainStatus);
      setStatus(res);
    } catch (e: unknown) {
      setStatus({ error: getErrorMessage(e) });
    }
  };

  const doDeploy = async () => {
    setDeploying(true);
    try {
      const res = await apiClient.post<{ address?: string; tx_hash?: string }>(API_ENDPOINTS.blockchainDeploy, {});
      // set status and show returned address/tx
      setStatus(prev => ({ ...(prev || {}), address: res.address }));
      if (res.tx_hash) setTx(res.tx_hash);
      if (res.address) setBackendDeployedAddress(res.address);
      // also refresh status from backend
      try {
        const s = await apiClient.get<BlockchainStatus>(API_ENDPOINTS.blockchainStatus);
        setStatus(s);
      } catch {
        // ignore
      }
    } catch (e: unknown) {
      setStatus({ error: getErrorMessage(e) });
    } finally {
      setDeploying(false);
    }
  };

  const doRegistrar = async () => {
    try {
      // normalize: remove whitespace and optional 0x prefix
      let normalized = (hashInput || '').trim();
      if (normalized.startsWith('0x') || normalized.startsWith('0X')) normalized = normalized.slice(2);
      normalized = normalized.replace(/\s+/g, '');

      // Accept either a 64-hex SHA256 or a tx hash (we'll allow variable lengths for tx hash but require hex)
      const isHex = /^[0-9a-fA-F]+$/.test(normalized);
      if (!isHex) {
        setHashError('Formato inválido: somente caracteres hex são permitidos (0-9, a-f).');
        return;
      }

      if (normalized.length !== 64 && normalized.length !== 64 /* For now we still prefer 64 hex, but allow any hex for tx*/ ) {
        // if user provided a tx hash, it might be longer (variable); we accept it but warn if too short
        if (normalized.length < 8) {
          setHashError('Hash muito curta. Cole a tx hash completa ou um SHA256 hex de 64 chars.');
          return;
        }
      }

      setHashError(null);
      const payload = { contrato_hash: '0x' + normalized };
      const res = await apiClient.post<{ tx_hash?: string; receipt?: Record<string, unknown> }>(API_ENDPOINTS.blockchainRegistrar, payload);
      const txhash = String(res.tx_hash ?? res.receipt?.transactionHash ?? '');
      setTx(txhash);
      if (res.receipt) setLastReceipt(res.receipt);
    } catch (e: unknown) {
      setTx('ERROR: ' + getErrorMessage(e));
    }
  };

  // Wallet/MetaMask flows removed per request
  const [createdUserWallet, setCreatedUserWallet] = useState<string | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [deployingForUser, setDeployingForUser] = useState<boolean>(false);
  const [userDialogOpen, setUserDialogOpen] = useState<boolean>(false);

  // form state for user creation modal
  const [formNome, setFormNome] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formCpf, setFormCpf] = useState<string>('');
  const [formEndereco, setFormEndereco] = useState<string>('');
  const [formRenda, setFormRenda] = useState<number | ''>('');
  const [formCelular, setFormCelular] = useState<string>('');
  const [formFacial, setFormFacial] = useState<number | ''>('');
  const [formSaldo, setFormSaldo] = useState<number | ''>('');


  const createUser = async (payload?: Record<string, unknown>) => {
    setCreatingUser(true);
    try {
      const body = payload ?? {
        nome: formNome || `Teste ${Date.now()}`,
        email: formEmail || `test${Date.now()}@example.com`,
        cpf: formCpf || '00000000000',
        endereco: formEndereco || '',
        renda_mensal: formRenda || 0,
        celular: formCelular || '',
        facial: formFacial || 0,
        saldo_cc: formSaldo || 0,
      };

  type CreateUserRes = { id: number; nome: string; email: string; saldo_cc: number; wallet_adress?: string };
  const res = await apiClient.post<CreateUserRes>(API_ENDPOINTS.usuarios, body);
      // API não retorna mais wallet_adress (fluxo de wallet removido)
      // close dialog on success
      setUserDialogOpen(false);
      // show created user wallet address if returned
      if (res.wallet_adress) {
        const wa = res.wallet_adress;
        setCreatedUserWallet(wa);
        // fetch on-chain status for that address
        try {
          const addrStatus = await apiClient.get<Record<string, unknown>>(`${API_ENDPOINTS.blockchainStatus.replace('/status','')}/address/${wa}/status`);
          // store as lastReceipt-like proof
          setLastReceipt({ transactionHash: addrStatus['address'] ?? wa, blockNumber: addrStatus['nonce'], status: addrStatus['has_code'] ? 'has_code' : 'no_code', ...addrStatus });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error('createUser error', err);
      setStatus({ error: getErrorMessage(err) });
    } finally {
      setCreatingUser(false);
    }
  };

  const deployForUser = async (ownerAddr?: string) => {
    const owner = ownerAddr || undefined;
    setDeployingForUser(true);
    try {
      const res = await apiClient.post<{ address?: string; tx_hash?: string }>(API_ENDPOINTS.blockchainDeploy, owner ? { owner_address: owner } : {});
      if (res.address) {
        setBackendDeployedAddress(res.address);
        setStatus({ deployed: true, address: res.address, abi_present: true });
      }
      if (res.tx_hash) setTx(res.tx_hash);
    } catch (err) {
      setStatus({ error: getErrorMessage(err) });
    } finally {
      setDeployingForUser(false);
    }
  };


  // callConsultarHash removed (wallet flows not used)

  return (
    <div className="min-h-screen bg-background py-8">
      <main className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-primary">{t('title')}</h1>
          <div className="flex gap-2 items-center">
            <button title="Português" aria-label="Português" onClick={() => setLang('pt')} className={`px-3 py-2 rounded-lg text-sm ${lang==='pt' ? 'bg-primary/10' : 'hover:bg-slate-100'}`}>🇧🇷</button>
            <button title="English" aria-label="English" onClick={() => setLang('en')} className={`px-3 py-2 rounded-lg text-sm ${lang==='en' ? 'bg-primary/10' : 'hover:bg-slate-100'}`}>🇺🇸</button>
            <button title="Español" aria-label="Español" onClick={() => setLang('es')} className={`px-3 py-2 rounded-lg text-sm ${lang==='es' ? 'bg-primary/10' : 'hover:bg-slate-100'}`}>🇪🇸</button>
          </div>
        </div>

  <div className="p-6 bg-card rounded-2xl border-2 border-primary/10 space-y-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{t('interaction')}</h2>
          </div>

          <div className="flex flex-wrap gap-2 ">
            <Button variant="outline" onClick={fetchStatus}>{t('view_status')}</Button>
            <Button variant="default" onClick={doDeploy} disabled={deploying}>{deploying ? t('deploying') : t('deploy_backend')}</Button>
            <Button variant="ghost" onClick={async () => {
              try {
                const res = await apiClient.get<Record<string, unknown>>(API_ENDPOINTS.blockchainCompile);
                setCompiledArtifact(res);
                setShowCompiled(true);
              } catch (e) {
                setStatus({ error: getErrorMessage(e) });
              }
            }}>{t('abi_json')}</Button>
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar usuário</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2">
                  <Input placeholder="Nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} />
                  <Input placeholder="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  <Input placeholder="CPF" value={formCpf} onChange={(e) => setFormCpf(e.target.value)} />
                  <Input placeholder="Endereço" value={formEndereco} onChange={(e) => setFormEndereco(e.target.value)} />
                  <Input placeholder="Renda mensal" value={String(formRenda)} onChange={(e) => setFormRenda(e.target.value === '' ? '' : Number(e.target.value))} />
                  <Input placeholder="Celular" value={formCelular} onChange={(e) => setFormCelular(e.target.value)} />
                  <Input placeholder="Facial (float)" value={String(formFacial)} onChange={(e) => setFormFacial(e.target.value === '' ? '' : Number(e.target.value))} />
                  <Input placeholder="Saldo inicial" value={String(formSaldo)} onChange={(e) => setFormSaldo(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <DialogFooter>
                  <div className="flex gap-2">
                    <Button onClick={() => setUserDialogOpen(false)} variant="ghost">Cancelar</Button>
                    <Button onClick={() => createUser()} disabled={creatingUser}>{creatingUser ? 'Criando...' : 'Criar usuário'}</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Deploy para usuário removido: deploy sempre feito pela chave do servidor */}
          </div>
          {statusMessage && <div className="mt-3 text-sm text-success">{statusMessage}</div>}
          {errorMessage && <div className="mt-3 text-sm text-destructive">{errorMessage}</div>}
        </div>
        

  <div className="p-6 bg-card rounded-2xl border-2 border-primary/10">
          <label className="block text-sm font-medium mb-2">{t('registrar_label')}</label>
          <div className="text-sm text-muted-foreground mb-2">{t('registrar_help')}</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Input value={hashInput} onChange={(e) => setHashInput(e.target.value)} placeholder="SHA256 hex (64 chars) ou tx hash" />
            <div className="flex gap-2 md:col-span-2">
              <Button onClick={doRegistrar} variant="default">{t('registrar_button')}</Button>
              <Button variant="outline" onClick={() => setHashInput(tx)}>{t('use_last_tx')}</Button>
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(tx || '')}>{t('copy_last_tx')}</Button>
            </div>
            {hashError && <div className="text-sm text-destructive md:col-span-3">{hashError}</div>}
          </div>
          <div className="text-xs text-muted-foreground mt-2">{t('registrar_help')}</div>
        </div>

  <div className="bg-muted p-6 rounded-2xl">
          <div className="mb-2"><strong>{t('status')}</strong></div>
          <pre className="text-sm mb-2">{status ? JSON.stringify(status, null, 2) : '—'}</pre>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div><strong>{t('backend')}</strong><div className="text-sm">{backendDeployedAddress || '—'}</div></div>
            <div><strong>{t('deployer')}</strong><div className="text-sm">{status?.deployer_address ?? (status?.deployer_present ? 'configured' : 'not configured')}</div></div>
            {/* Wallet display removed */}
            <div>
              <strong>{t('user_created_no_wallet')}</strong>
              <div className="text-sm">{status ? '—' : '—'}</div>
            </div>
            <div><strong>{t('last_tx')}</strong><div className="text-sm">{tx || '—'}</div></div>
          </div>
          {lastReceipt && (
            <div className="mt-3 p-3 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div>
                  <strong>{t('onchain_proof')}</strong>
                  <div className="text-sm">Tx: {lastReceipt.transactionHash as string}</div>
                  <div className="text-sm">Block: {String(lastReceipt.blockNumber ?? '—')}</div>
                  <div className="text-sm">Status: {String(lastReceipt.status ?? '—')}</div>
                  {
                    (() => {
                      // derive contract address: prefer contractAddress, then first log address, then fallback to global status.address
                      const lr = lastReceipt as Record<string, unknown>;
                      const ca = (lr['contractAddress'] as string | undefined) || (Array.isArray(lr['logs']) && (lr['logs'] as unknown[])[0] && ((lr['logs'] as unknown[])[0] as Record<string, unknown>)['address']) || (status?.address as string | undefined);
                      if (!ca) return null;
                      // if ca looks like a hex without 0x, add prefix
                      const normalized = String(ca).startsWith('0x') ? String(ca) : `0x${String(ca)}`;
                      const inferred = !(lastReceipt.contractAddress);
                      return (
                        <div className="text-sm">{t('contract')} {normalized} {inferred && <span className="text-xs text-muted-foreground"></span>}</div>
                      );
                    })()
                  }
                  {
                    (() => {
                      // try to parse indexed registrador address from topics[2] if present
                      try {
                        const lr = lastReceipt as Record<string, unknown>;
                        const firstLog = (Array.isArray(lr['logs']) && (lr['logs'] as unknown[])[0]) as Record<string, unknown> | undefined;
                        const topics = (firstLog && Array.isArray(firstLog['topics']) ? (firstLog['topics'] as unknown[]) : []) as unknown[];
                        if (topics && topics.length >= 3) {
                          const topic2 = String(topics[2]);
                          // topic may be hex without 0x
                          const hex = topic2.startsWith('0x') ? topic2 : `0x${topic2}`;
                          // last 40 chars are address
                          const addr = `0x${hex.replace(/^0x/, '').slice(-40)}`;
                          return <div className="text-sm">{t('registrador')} {addr}</div>;
                        }
                      } catch (e) {
                        /* ignore */
                      }
                      return null;
                    })()
                  }
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(String(lastReceipt.transactionHash ?? tx))}>{t('copy_tx')}</Button>
                  <Button variant="ghost" onClick={() => setShowRawReceipt(s => !s)}>{showRawReceipt ? t('hide_raw') : t('show_raw')}</Button>
                </div>
              </div>
              {showRawReceipt && <pre className="text-xs mt-2">{JSON.stringify(lastReceipt, null, 2)}</pre>}
            </div>
          )}

          {showCompiled && compiledArtifact && (
            <div className="mt-3 p-3 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div><strong>{t('compiled_artifact')}</strong></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(compiledArtifact))}>{t('copy_json')}</Button>
                  <Button variant="ghost" onClick={() => setShowCompiled(false)}>{t('close')}</Button>
                </div>
              </div>
              <pre className="text-xs mt-2 max-h-60 overflow-auto">{JSON.stringify(compiledArtifact, null, 2)}</pre>
            </div>
          )}
        </div>

  <div className="p-6 bg-card rounded-2xl border-2 border-primary/10 mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('create_user')}</h3>
          <p className="text-sm text-muted-foreground mb-3">{t('create_test_user_note')}</p>
          <div className="flex gap-2">
            <Button onClick={() => createUser()} disabled={creatingUser}>{creatingUser ? t('creating') : t('create_test_user')}</Button>
          </div>

          {createdUserWallet && (
            <div className="mt-4 p-3 bg-white rounded border">
              <div><strong>Wallet criada:</strong></div>
              <div className="text-sm break-all">{createdUserWallet}</div>
              <div className="mt-2"><strong>Prova on-chain:</strong></div>
              <div className="text-sm">{lastReceipt ? `Balance: ${String(lastReceipt.balance_eth ?? lastReceipt.blockNumber ?? '—')} ETH · Nonce: ${String(lastReceipt.nonce ?? '—')} · Has code: ${String(lastReceipt.has_code ?? '—')}` : 'Carregando...'}</div>
              <div className="mt-2">
                <Button variant="outline" onClick={async () => {
                  try {
                    const status = await apiClient.get<Record<string, unknown>>(`/blockchain/address/${createdUserWallet}/status`);
                    setLastReceipt(status);
                  } catch (e) {
                    setStatus({ error: getErrorMessage(e) });
                  }
                }}>{t('update_proof')}</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Test;
