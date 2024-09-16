import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

import { cn } from "@/lib/utils";

type Props = {
  account: string;
  accountId: string;
};

// AccountColumn component to display an account name and handle click events
// to open the account details. It uses the useOpenAccount hook to get the
// onOpenAccount function, which is called with the accountId when the div is clicked.
export const AccountColumn = ({ account, accountId }: Props) => {
  // Destructure the onOpen function from the useOpenAccount hook and rename it to onOpenAccount
  const { onOpen: onOpenAccount } = useOpenAccount();

  // Function to handle the click event and open the account details
  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    // Render a div with the account name, which is clickable and has a hover effect
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  );
};
