"use client";

import { useState, useEffect } from "react";
import CareerForm from "../CareerForm";
import RoleSelectionForm from "../forms/RoleSelectionForm";
import { Button } from "@/components/ui/button";
import { RoleSelectData, CareerFormData } from "@/types/career";
import { useLocalStorageSSR } from "@/hooks/use-local-storage";

const ROLE_STORAGE_KEY = "everkind-selected-role";
const CAREER_DATA_KEY = "everkind-career-data";

/**
 * Role Selection Client Component
 * Manages role selection and career application flow with localStorage persistence
 */
export default function RoleSelectionClient() {
  const [selectedRole, setSelectedRole, clearSelectedRole, roleMounted] =
    useLocalStorageSSR(ROLE_STORAGE_KEY, "");
  const [careerData, setCareerData, clearCareerData, dataMounted] =
    useLocalStorageSSR<CareerFormData>(CAREER_DATA_KEY, {});

  const mounted = roleMounted && dataMounted;

  /**
   * Handles role selection and updates both role and career data
   */
  const handleRoleSelect = (data: RoleSelectData) => {
    const newRole = data.role || "";
    const updatedCareerData = { ...careerData, role: data.role };

    setSelectedRole(newRole);
    setCareerData(updatedCareerData);
  };

  /**
   * Handles role change - clears selected role and returns to role selection
   */
  const handleChangeRole = () => {
    clearSelectedRole();
  };

  // Show loading or default state until mounted
  if (!mounted) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Position
            </h2>
            <p className="text-muted-foreground">
              Select the role you&apos;re interested in applying for. Each
              position has different requirements and qualifications.
            </p>
          </div>
          <RoleSelectionForm
            careerData={careerData}
            setCareerData={handleRoleSelect}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selectedRole ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Choose Your Position
              </h2>
              <p className="text-muted-foreground">
                Select the role you&apos;re interested in applying for. Each
                position has different requirements and qualifications.
              </p>
            </div>
            <RoleSelectionForm
              careerData={careerData}
              setCareerData={handleRoleSelect}
            />
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Apply for {selectedRole}
              </h2>
              <p className="text-muted-foreground mb-4">
                Fill out the form below to submit your application. We&apos;ll
                review your qualifications and get back to you soon.
              </p>
              <Button onClick={handleChangeRole} variant="link">
                ← Change Role
              </Button>
            </div>

            <CareerForm selectedRole={selectedRole} />
          </>
        )}
      </div>
    </section>
  );
}
