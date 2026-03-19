import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useState } from 'react'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Chef Alex',
    email: 'alex@cheflog.app',
    phone: '+44 7700 000000',
    business: "Alex's Private Chef Services",
  })

  function handleChange(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-gray-900">Profile</h3></CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Display name" value={profile.name} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <Input label="Email" value={profile.email} onChange={e => handleChange('email', e.target.value)} />
            <Input label="Phone" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} />
            <div className="col-span-2">
              <Input label="Business name" value={profile.business} onChange={e => handleChange('business', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm">Save changes</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-gray-900">About</h3></CardHeader>
        <CardBody>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>App version</span>
              <span className="text-gray-700">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-green-600 font-medium">Beta — internal testing</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
