"use client"

import { Badge } from "@/components/ui/badge"
import { TableCell, TableBody, TableHead, TableRow, TableHeader, Table } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AgentSettings() {
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

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [notificationTypes, setNotificationTypes] = useState({
    newTaskAssignments: true,
    documentVerification: true,
    transactionStatusChanges: true,
    complaintResponses: true,
    closingDateReminders: true
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoadingProfile(true)
        const response = await fetch('/api/agent/settings/profile')
        
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

  // Fetch notification preferences
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        setIsLoadingNotifications(true)
        const response = await fetch('/api/agent/settings/notifications')
        
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
              newTaskAssignments: data.data.notificationTypes.newTaskAssignments,
              documentVerification: data.data.notificationTypes.documentVerification,
              transactionStatusChanges: data.data.notificationTypes.transactionStatusChanges,
              complaintResponses: data.data.notificationTypes.complaintResponses,
              closingDateReminders: data.data.notificationTypes.closingDateReminders
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
        const response = await fetch('/api/agent/settings/security')
        
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

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setIsSavingProfile(true)
      const response = await fetch('/api/agent/settings/profile', {
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

  // Handle notification preferences update
  const handleNotificationUpdate = async () => {
    try {
      setIsSavingNotifications(true)
      const response = await fetch('/api/agent/settings/notifications', {
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
      const response = await fetch('/api/agent/settings/security', {
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
      const response = await fetch('/api/agent/settings/security', {
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
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
                    <AvatarFallback>JS</AvatarFallback>
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
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input 
                        id="teamName" 
                        value={profileData.teamName} 
                        onChange={(e) => setProfileData({...profileData, teamName: e.target.value})}
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

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update your professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell clients about yourself"
                  defaultValue="Experienced real estate agent with over 5 years of experience in the Austin market. Specializing in residential properties and first-time home buyers."
                ></textarea>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Select defaultValue="residential">
                  <SelectTrigger id="specialties">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  <Input id="languages" defaultValue="English, Spanish" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-media">Social Media Links</Label>
                <div className="space-y-2">
                  <Input placeholder="LinkedIn URL" defaultValue="https://linkedin.com/in/johnsmith" />
                  <Input placeholder="Facebook URL" defaultValue="https://facebook.com/johnsmithrealestate" />
                  <Input placeholder="Instagram URL" defaultValue="https://instagram.com/johnsmithrealestate" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
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
                        <span className="text-sm">New task assignments</span>
                        <Switch 
                          checked={notificationTypes.newTaskAssignments} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, newTaskAssignments: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document verification status</span>
                        <Switch 
                          checked={notificationTypes.documentVerification} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, documentVerification: checked})}
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
                        <span className="text-sm">Complaint responses</span>
                        <Switch 
                          checked={notificationTypes.complaintResponses} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, complaintResponses: checked})}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Closing date reminders</span>
                        <Switch 
                          checked={notificationTypes.closingDateReminders} 
                          onCheckedChange={(checked) => setNotificationTypes({...notificationTypes, closingDateReminders: checked})}
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

          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>Recent login activity for your account</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSecurity ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : loginHistory.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loginHistory.map((login, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(login.date).toLocaleString()}</TableCell>
                          <TableCell>{login.ipAddress}</TableCell>
                          <TableCell>{login.device}</TableCell>
                          <TableCell>{login.location || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              Success
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No login history available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

