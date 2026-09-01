"use client";

import { useMemo } from "react";
import { AccountsRegistry } from "@/components/accounts/AccountsRegistry";
import { GovShell } from "@/components/civic/GovShell";
import { listAllAccounts } from "@/lib/accounts";

export default function GovernmentAccountsPage() {
  const accounts = useMemo(() => listAllAccounts(), []);

  return (
    <GovShell>
      <AccountsRegistry
        title="Registered accounts"
        description="Monitor every USSAP account — individuals, organisations, demo roles, and linked residential properties across Nigeria."
        accounts={accounts}
        variant="government"
      />
    </GovShell>
  );
}
