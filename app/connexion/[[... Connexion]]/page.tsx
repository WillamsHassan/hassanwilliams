import AuthWrapper from '@/app/components/authwrapper'; // Nom en PascalCase
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <AuthWrapper>
      <SignIn />
    </AuthWrapper>
  );
}
