import { useState } from 'react'
import { Card, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Chef Alex',
    businessName: "Alex's Private Chef Services",
    email: 'alex@cheflog.app',
    phone: '+44 7700 000000',
    address: 'London, United Kingdom',
  })

  const [preferences, setPreferences] = useState({
    currency: 'GBP',
    paymentTerms: '7',
    reminderDays: '3',
  })

  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function setP(field: string, value: string) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  function setPref(field: string, value: string) {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      <p className="text-[13px] text-surface-500">Profile and preferences</p>

      {/* Profile */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-surface-500 mb-3">Chef Profile</h2>
        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Your name" value={profile.name} onChange={e => setP('name', e.target.value)} />
              </div>
              <div className="col-span-2">
                <Input label="Business name" value={profile.businessName} onChange={e => setP('businessName', e.target.value)} />
              </div>
              <Input label="Email" type="email" value={profile.email} onChange={e => setP('email', e.target.value)} />
              <Input label="Phone" value={profile.phone} onChange={e => setP('phone', e.target.value)} />
              <div className="col-span-2">
                <Input label="Location" value={profile.address} onChange={e => setP('address', e.target.value)} />
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Billing */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-surface-500 mb-3">Billing</h2>
        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Currency" value={preferences.currency} onChange={e => setPref('currency', e.target.value)}>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
              <Select label="Default payment terms" value={preferences.paymentTerms} onChange={e => setPref('paymentTerms', e.target.value)}>
                <option value="0">Due on receipt</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </Select>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Reminders */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-surface-500 mb-3">Reminders</h2>
        <Card>
          <CardBody className="flex flex-col gap-3">
            <Select label="Send payment reminder" value={preferences.reminderDays} onChange={e => setPref('reminderDays', e.target.value)}>
              <option value="1">1 day before due date</option>
              <option value="3">3 days before due date</option>
              <option value="7">7 days before due date</option>
            </Select>
            <p className="text-[11px] font-medium text-surface-500 leading-relaxed">
              Reminders use the client's email address stored in their profile.
            </p>
          </CardBody>
        </Card>
      </section>

      {/* Quote template */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-surface-500 mb-3">Quote Template</h2>
        <Card>
          <CardBody>
            <div className="py-4 text-center">
              <p className="text-[13px] font-semibold text-surface-500">Coming soon</p>
              <p className="text-[11px] font-medium text-surface-400 mt-1 leading-relaxed">
                Send quotes with custom line items from each booking.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* App info */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-surface-500 mb-3">About</h2>
        <Card>
          <CardBody>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-surface-600">Version</span>
                <span className="text-[13px] font-bold text-surface-800 tabular-nums">0.2.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-surface-600">Status</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
                  Beta — internal
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} disabled={saved} size="md">
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
