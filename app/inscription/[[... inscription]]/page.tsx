import AuthWrapper from '@/app/components/authwrapper';
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <AuthWrapper>
      <SignUp />
    </AuthWrapper>
  );
}