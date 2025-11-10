"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Mail, User, Shield, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserSchema } from "@/app/admin/users/dto/create-user.dto";
import { CreateUserPayload } from "../../app/admin/users/dto/create-user.dto";
import { UserRoles } from "@/core/enums/users.enums";

interface AddUserModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onAddUser: (user: CreateUserPayload) => void;
}

export function AddUserModal({
  isOpen,
  loading,
  onClose,
  onAddUser,
}: AddUserModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = CreateUserSchema.safeParse({
      fullName: name,
      email,
      userRole: role,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // ✅ Valid data — proceed to create user
    onAddUser(result.data);

    // ✅ Reset form
    // setEmail("");
    // setName("");
    // setRole("");
    // setErrors({});
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md border border-border bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-mono font-semibold text-foreground">
              Add New User
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          {/* Info Box */}
          <div className="bg-accent/10 border mb-6 border-accent/20 rounded-lg">
            <p className="text-xs text-foreground">
              An invitation email will be sent to the user with a temporay
              password.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={`${errors.name ? "border-destructive" : ""}`}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Role Select */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Assign Role
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger value={role} className="w-[280px]-">
                <SelectValue placeholder="Assign Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"USER"}>User - Minimal access</SelectItem>
                <SelectItem value={"ADMIN"}>
                  Admin - Manage Users & Team
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.userRole && (
              <p className="text-xs text-destructive mt-1">{errors.userRole}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-10 gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-transparent col-span-3"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 col-span-7 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader />
                Sending Invitation
              </div>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
