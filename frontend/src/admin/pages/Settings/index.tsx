import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { getSystemConfigs, updateSystemConfigs, type SystemConfigMap } from '../../api/settings';
import { uploadFile, getImageUrl } from '../../api/common';
import { Loader2, Save, Upload, Store, Clock, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shop' | 'business' | 'security'>('shop');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [configs, setConfigs] = useState<SystemConfigMap>({});
  const { showToast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const res = await getSystemConfigs();
      if (res.code === 1 && res.data) {
        setConfigs(res.data);
      } else {
        // showToast(res.msg || 'Failed to load settings');
      }
    } catch (error) {
      // showToast('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSystemConfigs(configs);
      if (res.code === 1) {
        showToast('Settings saved successfully');
      } else {
        showToast(res.msg || 'Failed to save settings');
      }
    } catch (error) {
      showToast('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setConfigs(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadFile(file);
      if (res.code === 1 && res.data) {
        handleChange('shop.logo', res.data);
      } else {
        showToast('Upload failed');
      }
    } catch (error) {
      showToast('Upload error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={clsx(
        "flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors",
        activeTab === id
          ? "border-orange-500 text-orange-600"
          : "border-transparent text-zinc-500 hover:text-zinc-900"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h2>
          <p className="text-zinc-500">Manage your store profile and business rules.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={clsx(
            "flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors",
            saving && "opacity-70 cursor-not-allowed"
          )}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-2">
          <div className="flex gap-2">
            <TabButton id="shop" label="Shop Profile" icon={Store} />
            <TabButton id="business" label="Business Rules" icon={Clock} />
            <TabButton id="security" label="Security" icon={ShieldCheck} />
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'shop' && (
            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Store Logo</label>
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
                    {configs['shop.logo'] ? (
                      <img 
                        src={getImageUrl(configs['shop.logo'])} 
                        alt="Logo" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <Store className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50">
                      Change Logo
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    <p className="mt-2 text-xs text-zinc-500">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Store Name</label>
                <input
                  type="text"
                  value={configs['shop.name'] || ''}
                  onChange={(e) => handleChange('shop.name', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Contact Phone</label>
                <input
                  type="text"
                  value={configs['shop.phone'] || ''}
                  onChange={(e) => handleChange('shop.phone', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Address</label>
                <textarea
                  rows={3}
                  value={configs['shop.address'] || ''}
                  onChange={(e) => handleChange('shop.address', e.target.value)}
                  className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Description</label>
                <textarea
                  rows={2}
                  value={configs['shop.description'] || ''}
                  onChange={(e) => handleChange('shop.description', e.target.value)}
                  className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Business Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={configs['business.status'] === '1'}
                      onChange={() => handleChange('business.status', '1')}
                      className="text-orange-600 focus:ring-orange-500" 
                    />
                    <span className="text-sm text-zinc-700">Open</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={configs['business.status'] === '0'}
                      onChange={() => handleChange('business.status', '0')}
                      className="text-orange-600 focus:ring-orange-500" 
                    />
                    <span className="text-sm text-zinc-700">Closed (Stop taking orders)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Opening Hours</label>
                  <input
                    type="text"
                    value={configs['business.hours'] || ''}
                    onChange={(e) => handleChange('business.hours', e.target.value)}
                    placeholder="e.g. 09:00 - 22:00"
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Est. Delivery Time (mins)</label>
                  <input
                    type="number"
                    value={configs['delivery.time'] || ''}
                    onChange={(e) => handleChange('delivery.time', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Delivery Fee (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configs['delivery.fee'] || ''}
                    onChange={(e) => handleChange('delivery.fee', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Min. Order Amount (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configs['delivery.minOrder'] || ''}
                    onChange={(e) => handleChange('delivery.minOrder', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-lg bg-orange-50 p-4 text-sm text-orange-800">
                For security reasons, changing password requires verification of your current password.
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Current Password</label>
                <input
                  type="password"
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">New Password</label>
                <input
                  type="password"
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Confirm New Password</label>
                <input
                  type="password"
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="pt-4">
                <button 
                  className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  onClick={() => showToast('Password change feature coming soon')}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
