import React from "react";
import { PermissionType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
};

const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
  requiredPermission,
  children,
  showMessage = false,
}) => {
  const { hasPermission } = useAuthContext();

  if (!hasPermission(requiredPermission)) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {showMessage && (
          <>
            <h1 className="text-2xl font-bold text-red-500">
              Permission Denied
            </h1>
            <p className="text-gray-500">
              You do not have permission to access this resource.
            </p>
          </>
        )}
      </div>
    );
  }
  // If the user has the required permission, render the children
  return <>{children}</>;
};

export default PermissionsGuard;
