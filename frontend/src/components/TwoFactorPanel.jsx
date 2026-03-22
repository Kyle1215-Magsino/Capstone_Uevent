import { useState, useEffect } from 'react';
import {
  getTwoFactorStatus,
  enableTwoFactor,
  confirmTwoFactor,
  disableTwoFactor,
  getTwoFactorQrCode,
  getTwoFactorRecoveryCodes,
} from '../api/authApi';
import { toast } from 'react-toastify';

export default function TwoFactorPanel() {
  const [status, setStatus] = useState(null); // { enabled, confirmed }
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('idle'); // idle | qr | codes
  const [qrSvg, setQrSvg] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await getTwoFactorStatus();
      setStatus(res.data);
    } catch {
      setStatus({ enabled: false, confirmed: false });
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    setSaving(true);
    try {
      await enableTwoFactor();
      const qrRes = await getTwoFactorQrCode();
      setQrSvg(qrRes.data.svg);
      setStep('qr');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enable 2FA.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!confirmCode.trim()) return;
    setSaving(true);
    try {
      await confirmTwoFactor(confirmCode.trim());
      const codesRes = await getTwoFactorRecoveryCodes();
      setRecoveryCodes(codesRes.data.codes);
      setStep('codes');
      await loadStatus();
      toast.success('2FA activated! Save your recovery codes.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setSaving(false);
      setConfirmCode('');
    }
  };

  const handleDisable = async () => {
    setSaving(true);
    try {
      await disableTwoFactor();
      setStep('idle');
      setQrSvg('');
      setRecoveryCodes([]);
      await loadStatus();
      toast.success('Two-factor authentication disabled.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disable 2FA.');
    } finally {
      setSaving(false);
    }
  };

  const handleViewCodes = async () => {
    setSaving(true);
    try {
      const res = await getTwoFactorRecoveryCodes();
      setRecoveryCodes(res.data.codes);
      setStep('codes');
    } catch (err) {
      toast.error('Failed to load recovery codes.');
    } finally {
      setSaving(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // ── Recovery Codes view ──
  if (step === 'codes') {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-2.5">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="text-sm font-semibold text-yellow-800">Save your recovery codes</p>
              <p className="text-xs text-yellow-700 mt-0.5">Store these in a safe place. Each code can only be used once.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((code, i) => (
              <code key={i} className="text-xs font-mono text-green-400 tracking-widest">{code}</code>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyAll}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {copiedAll ? (
              <><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy All</>
            )}
          </button>
          <button
            onClick={() => setStep('idle')}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── QR Setup view ──
  if (step === 'qr') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Scan this QR code with your authenticator app (e.g. Google Authenticator, Authy), then enter the 6-digit code to confirm.
        </p>

        <div className="flex justify-center">
          <div
            className="border-2 border-green-200 rounded-xl p-3 bg-white inline-block"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </div>

        <form onSubmit={handleConfirm} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={confirmCode}
              onChange={e => setConfirmCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-2.5 text-center text-xl tracking-widest border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-green-400 focus:border-transparent"
              autoComplete="one-time-code"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setStep('idle'); handleDisable(); }}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || confirmCode.length !== 6}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {saving ? 'Verifying…' : 'Confirm & Activate'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── Idle / status view ──
  const isEnabled = status?.enabled && status?.confirmed;

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${isEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isEnabled ? 'bg-green-100' : 'bg-gray-200'}`}>
          <svg className={`w-5 h-5 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${isEnabled ? 'text-green-800' : 'text-gray-700'}`}>
            Two-Factor Authentication
          </p>
          <p className={`text-xs mt-0.5 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
            {isEnabled ? 'Active — your account has extra protection.' : 'Not enabled — your account is less secure.'}
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
          {isEnabled ? 'ON' : 'OFF'}
        </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a code from your authenticator app when logging in.
      </p>

      {isEnabled ? (
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={handleViewCodes}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            View Recovery Codes
          </button>
          <button
            onClick={handleDisable}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? 'Disabling…' : 'Disable 2FA'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleEnable}
          disabled={saving}
          className="w-full py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Setting up…</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Enable Two-Factor Auth</>
          )}
        </button>
      )}
    </div>
  );
}
