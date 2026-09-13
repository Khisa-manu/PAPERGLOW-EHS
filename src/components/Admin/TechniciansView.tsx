import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { 
  UserCheck, 
  UserPlus, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  KeyRound,
  X
} from 'lucide-react';

export const TechniciansView: React.FC = () => {
  const { allUsers, createTechnician, updateTechnician, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Tech Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customStartTime, setCustomStartTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const technicians = allUsers.filter(u => u.role === 'TECHNICIAN');
  const filteredTechs = technicians.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.employeeId && t.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !employeeId) {
      setFormError('Name, email, and employee ID are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const success = await createTechnician({
      fullName,
      email,
      employeeId,
      phoneNumber: phoneNumber || undefined,
      customExpectedStartTime: customStartTime || undefined,
    });

    setIsSubmitting(false);

    if (success) {
      setIsAddModalOpen(false);
      setFullName('');
      setEmail('');
      setEmployeeId('');
      setPhoneNumber('');
      setCustomStartTime('');
    } else {
      setFormError('Failed to create technician record.');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technician by name or EMP ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Technician</span>
        </button>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechs.map((tech) => (
          <div
            key={tech.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    {tech.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {tech.fullName}
                    </h4>
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {tech.employeeId || 'NO EMP ID'}
                    </span>
                  </div>
                </div>

                {/* Active status indicator */}
                <button
                  onClick={() => updateTechnician(tech.id, { isActive: !tech.isActive })}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                    tech.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                  title="Click to toggle active roster status"
                >
                  {tech.isActive ? 'Active' : 'Suspended'}
                </button>
              </div>

              {/* Contact and schedule details */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tech.email}</span>
                </div>
                {tech.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tech.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Expected Start:{' '}
                    <strong className="font-mono text-slate-900">
                      {tech.customExpectedStartTime || settings?.defaultExpectedStartTime || '08:00'} AM
                    </strong>
                    {tech.customExpectedStartTime ? ' (Custom Shift)' : ' (Default)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Added: {tech.createdAt.substring(0, 10)}
              </span>
              <button
                onClick={() => alert(`Password reset instructions simulated for ${tech.email}`)}
                className="text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                <span>Reset PIN</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TECHNICIAN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Onboard New Field Technician
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTechnician} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. david.vance@fieldpulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="EMP-1120"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    placeholder="(415) 555-0142"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Expected Start Time (Optional)
                </label>
                <input
                  type="time"
                  value={customStartTime}
                  onChange={(e) => setCustomStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Leave blank to inherit global system default (08:00 AM)
                </span>
              </div>

              {formError && (
                <p className="text-rose-600 font-semibold">{formError}</p>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Create Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
