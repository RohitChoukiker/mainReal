"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const initialTeamMembers = [
  { id: 1, name: "Jane Doe", email: "jane@example.com", role: "Admin" },
  { id: 2, name: "Mark Smith", email: "mark@example.com", role: "Viewer" },
]

export default function SettingsPage() {
  const [name, setName] = useState("Alex Broker")
  const [email, setEmail] = useState("alex@email.com")
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)

  const handleSaveProfile = () => {
    // Simulated save functionality
    alert("Profile saved!")
  }

  const handleChangePassword = () => {
    // Simulated password change functionality
    alert("Password change modal would open here")
  }

  const handleAddTeamMember = () => {
    // Simulated add team member functionality
    const newMember = {
      id: teamMembers.length + 1,
      name: "New Member",
      email: "new@example.com",
      role: "Viewer",
    }
    setTeamMembers([...teamMembers, newMember])
  }

  const handleRemoveTeamMember = (id: number) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="2fa" checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
            <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
          </div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Manage your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveTeamMember(member.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button onClick={handleAddTeamMember}>Add Team Member</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

