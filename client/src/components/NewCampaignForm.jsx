import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import Button from './ui/button';
import { getBrands } from '../api/brands';
import { createCampaign } from '../api/campaigns';

const STATUS_OPTIONS = ['active', 'paused', 'completed'];

const inputClass =
  "w-full px-3 py-2 text-sm rounded-lg border border-border bg-card-bg text-foreground " +
  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] " +
  "focus:border-[var(--color-primary)] transition-colors";

const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block";


function NewCampaignForm({ onSuccess, onCancel }) {
  const [brands, setBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '', brandId: '', status: 'active', budget: '', startDate: '', endDate: '',
  });

  useEffect(() => {
    getBrands().then((data) => setBrands(data || [])).catch((err) => console.error('Failed to load brands:', err));
  }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) return setError('Title is required.');
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      return setError('End date cannot be before start date.');
    }

    setIsSubmitting(true);
    try {
      const created = await createCampaign({
        title: form.title.trim(),
        brandId: form.brandId ? Number(form.brandId) : null,
        status: form.status,
        budget: form.budget ? Number(form.budget) : null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      onSuccess?.(created);
    } catch (err) {
      console.error('Failed to create campaign:', err);
      setError(err.message || 'Could not create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Title</label>
        <input type="text" value={form.title} onChange={handleChange('title')} placeholder="e.g. Q3 Product Launch" className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Brand</label>
        <select value={form.brandId} onChange={handleChange('brandId')} className={inputClass}>
          <option value="">Select a brand</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={handleChange('status')} className={inputClass}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Budget (USD)</label>
          <input type="number" min="0" step="0.01" value={form.budget} onChange={handleChange('budget')} placeholder="0.00" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" value={form.startDate} onChange={handleChange('startDate')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input type="date" value={form.endDate} onChange={handleChange('endDate')} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <div className="flex justify-end gap-2 mt-2">
        {onCancel && <Button type="button" label="Cancel" variant="ghost" onClick={onCancel} disabled={isSubmitting} />}
        <Button type="submit" label={isSubmitting ? 'Creating...' : 'Create Campaign'} icon={isSubmitting ? Loader2 : Plus} disabled={isSubmitting} />
      </div>
    </form>
  );
}

export default NewCampaignForm;