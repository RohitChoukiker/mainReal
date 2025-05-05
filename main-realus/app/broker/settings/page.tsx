"use client"

import { TableCell, TableBody, TableHead, TableRow, TableHeader, Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building2, Bell, Shield, CreditCard, CheckCircle, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BrokerSettings() {
  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    companyName: '',
    teamName: '',
    address: '',
    companyPhone: '',
    city: '',
    state: '',
    pinCode: '',
    timeZone: ''
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Brokerage state
  const [brokerageData, setBrokerageData] = useState({
    brokerageName: '',
    brokerageLicense: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
    transactionSettings: {
      autoAssignTC: true,
      defaultTC: '',
      requiredDocuments: [] as string[]
    }
  })
  const [isLoadingBrokerage, setIsLoadingBrokerage] = useState(true)
  const [isSavingBrokerage, setIsSavingBrokerage] = useState(false)
  const [autoAssignTC, setAutoAssignTC] = useState(true)

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [notificationTypes, setNotificationTypes] = useState({
    newAgentRegistrations: true,
    transactionStatusChanges: true,
    documentUploads: true,
    tcAssignments: true,
    complaints: true
  })
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  // Security state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [isLoadingSecurity, setIsLoadingSecurity] = useState(true)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)

  // Billing state
  const [billingData, setBillingData] = useState({
    subscriptionPlan: 'Professional',
    subscriptionPrice: 99,
    billingCycle: 'Monthly',
    nextBillingDate: new Date(),
    paymentMethods: [] as any[],
    billingHistory: [] as any[]
  })
  const [isLoadingBilling, setIsLoadingBilling] = useState(true)
  const [isSavingBilling, setIsSavingBilling] = useState(false)

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoadingProfile(true)
        const response = await fetch('/api/broker/settings/profile')
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setProfileData({
            name: data.data.name || '',
            email: data.data.email || '',
            mobile: data.data.mobile || '',
            companyName: data.data.companyName || '',
            teamName: data.data.teamName || '',
            address: data.data.address || '',
            companyPhone: data.data.companyPhone || '',
            city: data.data.city || '',
            state: data.data.state || '',
            pinCode: data.data.pinCode || '',
            timeZone: data.data.timeZone || ''
          })
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoadingProfile(false)
      }
    }
    
    fetchProfileData()
  }, [])

  // Fetch brokerage data
  useEffect(() => {
    const fetchBrokerageData = async () => {
      try {
        setIsLoadingBrokerage(true)
        const response = await fetch('/api/broker/settings/brokerage')
        
        if (!response.ok) {
          throw new Error('Failed to fetch brokerage data')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setBrokerageData({
            brokerageName: data.data.brokerageName || '',
            brokerageLicense: data.data.brokerageLicense || '',
            taxId: data.data.taxId || '',
            address: data.data.address || '',
            city: data.data.city || '',
            state: data.data.state || '',
            zipCode: data.data.zipCode || '',
            website: data.data.website || '',
            transactionSettings: {
              autoAssignTC: data.data.transactionSettings?.autoAssignTC ?? true,
              defaultTC: data.data.transactionSettings?.defaultTC || '',
              requiredDocuments: data.data.transactionSettings?.requiredDocuments || []
            }
          })
          
          setAutoAssignTC(data.data.transactionSettings?.autoAssignTC ?? true)
        }
      } catch (error) {
        console.error('Error fetching brokerage data:', error)
        toast.error('Failed to load brokerage data')
      } finally {
        setIsLoadingBrokerage(false)
      }
    }
    
    fetchBrokerageData()
  }, [])

  // Fetch notification preferences
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        setIsLoadingNotifications(true)
        const response = await fetch('/api/broker/settings/notifications')
        
        if (!response.ok) {
          throw new Error('Failed to fetch notification preferences')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setNotificationsEnabled(data.data.enableNotifications)
          setEmailNotifications(data.data.emailNotifications)
          setSmsNotifications(data.data.smsNotifications)
          
          if (data.data.notificationTypes) {
            setNotificationTypes({
              newAgentRegistrations: data.data.notificationTypes.newAgentRegistrations,
              transactionStatusChanges: data.data.notificationTypes.transactionStatusChanges,
              documentUploads: data.data.notificationTypes.documentUploads,
              tcAssignments: data.data.notificationTypes.tcAssignments,
              complaints: data.data.notificationTypes.complaints
            })
          }
        }
      } catch (error) {
        console.error('Error fetching notification preferences:', error)
        toast.error('Failed to load notification preferences')
      } finally {
        setIsLoadingNotifications(false)
      }
    }
    
    fetchNotificationPreferences()
  }, [])

  // Fetch security settings
  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        setIsLoadingSecurity(true)
        const response = await fetch('/api/broker/settings/security')
        
        if (!response.ok) {
          throw new Error('Failed to fetch security settings')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setTwoFactorEnabled(data.data.twoFactorEnabled)
          setLoginHistory(data.data.loginHistory || [])
        }
      } catch (error) {
        console.error('Error fetching security settings:', error)
        toast.error('Failed to load security settings')
      } finally {
        setIsLoadingSecurity(false)
      }
    }
    
    fetchSecuritySettings()
  }, [])

  // Fetch billing data
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setIsLoadingBilling(true)
        const response = await fetch('/api/broker/settings/billing')
        
        if (!response.ok) {
          throw new Error('Failed to fetch billing data')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setBillingData({
            subscriptionPlan: data.data.subscriptionPlan || 'Professional',
            subscriptionPrice: data.data.subscriptionPrice || 99,
            billingCycle: data.data.billingCycle || 'Monthly',
            nextBillingDate: new Date(data.data.nextBillingDate) || new Date(),
            paymentMethods: data.data.paymentMethods || [],
            billingHistory: data.data.billingHistory || []
          })
        }
      } catch (error) {
        console.error('Error fetching billing data:', error)
        toast.error('Failed to load billing data')
      } finally {
        setIsLoadingBilling(false)
      }
    }
    
    fetchBillingData()
  }, [])

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setIsSavingProfile(true)
      const response = await fetch('/api/broker/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Profile updated successfully')
      } else {
        throw new Error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle brokerage update
  const handleBrokerageUpdate = async () => {
    try {
      setIsSavingBrokerage(true)
      
      // Update the autoAssignTC in the brokerageData
      const updatedBrokerageData = {
        ...brokerageData,
        transactionSettings: {
          ...brokerageData.transactionSettings,
          autoAssignTC
        }
      }
      
      const response = await fetch('/api/broker/settings/brokerage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBrokerageData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update brokerage information')
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Brokerage information updated successfully')
      } else {
        throw new Error(data.message || 'Failed to update brokerage information')
      }
    } catch (error) {
      console.error('Error updating brokerage information:', error)
      toast.error('Failed to update brokerage information')
    } finally {
      setIsSavingBrokerage(false)
    }
  }

  // Handle notification preferences update
  const handleNotificationUpdate = async () => {
    try {
      setIsSavingNotifications(true)
      const response = await fetch('/api/broker/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enableNotifications: notificationsEnabled,
          emailNotifications: emailNotifications,
          smsNotifications: smsNotifications,
          notificationTypes: notificationTypes
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update notification preferences')
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Notification preferences updated successfully')
      } else {
        throw new Error(data.message || 'Failed to update notification preferences')
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      toast.error('Failed to update notification preferences')
    } finally {
      setIsSavingNotifications(false)
    }
  }

  // Handle password update
  const handlePasswordUpdate = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match')
        return
      }
      
      setIsSavingPassword(true)
      const response = await fetch('/api/broker/settings/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update password')
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        throw new Error(data.message || 'Failed to update password')
      }
    } catch (error: any) {
      console.error('Error updating password:', error)
      toast.error(error.message || 'Failed to update password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  // Handle 2FA toggle
  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      setIsSavingSecurity(true)
      const response = await fetch('/api/broker/settings/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          twoFactorEnabled: enabled,
          generateRecoveryCodes: enabled
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update security settings')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setTwoFactorEnabled(enabled)
        
        if (data.data && data.data.recoveryCodes) {
          setRecoveryCodes(data.data.recoveryCodes)
        }
        
        toast.success('Security settings updated successfully')
      } else {
        throw new Error(data.message || 'Failed to update security settings')
      }
    } catch (error) {
      console.error('Error updating security settings:', error)
      toast.error('Failed to update security settings')
    } finally {
      setIsSavingSecurity(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="brokerage" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Brokerage</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Change Photo</span>
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={isLoadingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Phone</Label>
                      <Input 
                        id="mobile" 
                        value={profileData.mobile} 
                        onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                        disabled={isLoadingProfile}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email} 
                      disabled={true} // Email should not be editable
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={profileData.companyName} 
                        onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                        disabled={isLoadingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input 
                        id="companyPhone" 
                        value={profileData.companyPhone} 
                        onChange={(e) => setProfileData({...profileData, companyPhone: e.target.value})}
                        disabled={isLoadingProfile}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {isLoadingProfile ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              ) : (
                <Button onClick={handleProfileUpdate} disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="brokerage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brokerage Information</CardTitle>
              <CardDescription>Update your brokerage details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingBrokerage ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="brokerage-name">Brokerage Name</Label>
                    <Input 
                      id="brokerage-name" 
                      value={brokerageData.brokerageName} 
                      onChange={(e) => setBrokerageData({...brokerageData, brokerageName: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brokerage-license">Brokerage License #</Label>
                      <Input 
                        id="brokerage-license" 
                        value={brokerageData.brokerageLicense} 
                        onChange={(e) => setBrokerageData({...brokerageData, brokerageLicense: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-id">Tax ID / EIN</Label>
                      <Input 
                        id="tax-id" 
                        value={brokerageData.taxId} 
                        onChange={(e) => setBrokerageData({...brokerageData, taxId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={brokerageData.address} 
                      onChange={(e) => setBrokerageData({...brokerageData, address: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={brokerageData.city} 
                        onChange={(e) => setBrokerageData({...brokerageData, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select 
                        value={brokerageData.state} 
                        onValueChange={(value) => setBrokerageData({...brokerageData, state: value})}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tx">Texas</SelectItem>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="fl">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input 
                        id="zip" 
                        value={brokerageData.zipCode} 
                        onChange={(e) => setBrokerageData({...brokerageData, zipCode: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      value={brokerageData.website} 
                      onChange={(e) => setBrokerageData({...brokerageData, website: e.target.value})}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleBrokerageUpdate} 
                disabled={isLoadingBrokerage || isSavingBrokerage}
              >
                {isSavingBrokerage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Settings</CardTitle>
              <CardDescription>Configure transaction workflow settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingBrokerage ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-assign">Auto-assign Transaction Coordinators</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically assign TCs to new transactions based on workload
                      </p>
                    </div>
                    <Switch 
                      id="auto-assign" 
                      checked={autoAssignTC} 
                      onCheckedChange={setAutoAssignTC} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-tc">Default Transaction Coordinator</Label>
                    <Select 
                      value={brokerageData.transactionSettings.defaultTC || 'sarah'} 
                      onValueChange={(value) => setBrokerageData({
                        ...brokerageData, 
                        transactionSettings: {
                          ...brokerageData.transactionSettings,
                          defaultTC: value
                        }
                      })}
                      disabled={!autoAssignTC}
                    >
                      <SelectTrigger id="default-tc">
                        <SelectValue placeholder="Select default TC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="michael">Michael Brown</SelectItem>
                        <SelectItem value="emily">Emily Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="required-docs">Required Documents</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border rounded-md">
                      {brokerageData.transactionSettings.requiredDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                      {brokerageData.transactionSettings.requiredDocuments.length === 0 && (
                        <div className="col-span-2 text-center py-2 text-muted-foreground">
                          No required documents configured
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        // This would typically open a modal to customize documents
                        // For now, we'll just set some default documents
                        setBrokerageData({
                          ...brokerageData,
                          transactionSettings: {
                            ...brokerageData.transactionSettings,
                            requiredDocuments: [
                              'Purchase Agreement',
                              'Property Disclosure',
                              'Inspection Report',
                              'Financing Pre-Approval',
                              'Title Report',
                              'Insurance Binder'
                            ]
                          }
                        });
                        toast.success('Required documents updated');
                      }}
                    >
                      Customize Required Documents
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleBrokerageUpdate} 
                disabled={isLoadingBrokerage || isSavingBrokerage}
              >
                {isSavingBrokerage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about important updates</p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notificationsEnabled} 
                      onCheckedChange={setNotificationsEnabled} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Types</Label>
                    <div className="space-y-2 p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New agent registrations</span>
                        <Switch 
                          checked={notificationTypes.newAgentRegistrations} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, newAgentRegistrations: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Transaction status changes</span>
                        <Switch 
                          checked={notificationTypes.transactionStatusChanges} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, transactionStatusChanges: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document uploads</span>
                        <Switch 
                          checked={notificationTypes.documentUploads} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, documentUploads: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">TC assignments</span>
                        <Switch 
                          checked={notificationTypes.tcAssignments} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, tcAssignments: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Complaints</span>
                        <Switch 
                          checked={notificationTypes.complaints} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, complaints: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleNotificationUpdate} 
                disabled={isLoadingNotifications || isSavingNotifications}
              >
                {isSavingNotifications ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSecurity ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handlePasswordUpdate} 
                disabled={isLoadingSecurity || isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSecurity ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled} 
                      onCheckedChange={handleTwoFactorToggle}
                      disabled={isSavingSecurity}
                    />
                  </div>

                  {twoFactorEnabled && recoveryCodes.length > 0 && (
                    <div className="space-y-2">
                      <Label>Recovery Codes</Label>
                      <p className="text-sm text-muted-foreground">
                        Save these recovery codes in a secure place to use if you lose access to your authentication app.
                      </p>
                      <div className="p-4 bg-muted rounded-md font-mono text-sm">
                        {recoveryCodes.map((code, index) => (
                          <div key={index}>
                            {code}
                            {index < recoveryCodes.length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Create a text file with recovery codes
                          const text = recoveryCodes.join('\n');
                          const blob = new Blob([text], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'recovery-codes.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download Recovery Codes
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {isSavingSecurity && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">$99/month</p>
                  </div>
                  <Badge>Current Plan</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Unlimited transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Up to 25 agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>AI-powered insights</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">View All Plans</Button>
                <Button>Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                    </div>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">Add Payment Method</Button>
                <Button variant="outline">Edit Default Method</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your billing history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        date: "Apr 1, 2025",
                        description: "Professional Plan - Monthly",
                        amount: "$99.00",
                        status: "Paid",
                      },
                      {
                        date: "Mar 1, 2025",
                        description: "Professional Plan - Monthly",
                        amount: "$99.00",
                        status: "Paid",
                      },
                      {
                        date: "Feb 1, 2025",
                        description: "Professional Plan - Monthly",
                        amount: "$99.00",
                        status: "Paid",
                      },
                    ].map((invoice, index) => (
                      <TableRow key={index}>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

