"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Upload } from "lucide-react"

export default function TCSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [autoTaskReminders, setAutoTaskReminders] = useState(true)

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
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Change Photo</span>
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="Sarah" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Johnson" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="sarah.johnson@example.com" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="(555) 987-6543" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="Transaction Coordinator" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Preferences</CardTitle>
              <CardDescription>Configure your work settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="working-hours">Working Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-12">Start:</span>
                    <Select defaultValue="9">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8:00 AM</SelectItem>
                        <SelectItem value="9">9:00 AM</SelectItem>
                        <SelectItem value="10">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-12">End:</span>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4:00 PM</SelectItem>
                        <SelectItem value="5">5:00 PM</SelectItem>
                        <SelectItem value="6">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-transactions">Maximum Active Transactions</Label>
                <Select defaultValue="15">
                  <SelectTrigger id="max-transactions">
                    <SelectValue placeholder="Select maximum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 transactions</SelectItem>
                    <SelectItem value="15">15 transactions</SelectItem>
                    <SelectItem value="20">20 transactions</SelectItem>
                    <SelectItem value="25">25 transactions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-task-reminders">Automatic Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send automatic reminders to agents for upcoming tasks</p>
                </div>
                <Switch id="auto-task-reminders" checked={autoTaskReminders} onCheckedChange={setAutoTaskReminders} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Select defaultValue="24" disabled={!autoTaskReminders}>
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 hours before due</SelectItem>
                    <SelectItem value="24">24 hours before due</SelectItem>
                    <SelectItem value="48">48 hours before due</SelectItem>
                    <SelectItem value="72">72 hours before due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about important updates</p>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
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
                    <span className="text-sm">New transaction assignments</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document uploads</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Task completions</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approaching deadlines</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Broker messages</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Schedule</CardTitle>
              <CardDescription>Configure when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Do Not Disturb</Label>
                  <p className="text-sm text-muted-foreground">Pause notifications during specific hours</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select defaultValue="18">
                    <SelectTrigger>
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="17">5:00 PM</SelectItem>
                      <SelectItem value="18">6:00 PM</SelectItem>
                      <SelectItem value="19">7:00 PM</SelectItem>
                      <SelectItem value="20">8:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7:00 AM</SelectItem>
                      <SelectItem value="8">8:00 AM</SelectItem>
                      <SelectItem value="9">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Days of Week</Label>
                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Switch id={`day-${day}`} defaultChecked={index < 5} />
                      <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Schedule</Button>
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
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Recovery Codes</Label>
                <p className="text-sm text-muted-foreground">
                  Save these recovery codes in a secure place to use if you lose access to your authentication app.
                </p>
                <div className="p-4 bg-muted rounded-md font-mono text-sm">
                  1234-5678-9012
                  <br />
                  2345-6789-0123
                  <br />
                  3456-7890-1234
                  <br />
                  4567-8901-2345
                  <br />
                  5678-9012-3456
                </div>
                <Button variant="outline" size="sm">
                  Download Recovery Codes
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">Chrome on Windows • Austin, TX</p>
                      <p className="text-xs text-muted-foreground">Started: Apr 12, 2025 09:45 AM</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mobile Session</p>
                      <p className="text-sm text-muted-foreground">Safari on iPhone • Austin, TX</p>
                      <p className="text-xs text-muted-foreground">Started: Apr 10, 2025 03:22 PM</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Sign Out All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

