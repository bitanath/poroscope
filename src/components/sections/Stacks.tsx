import { Flex,FlexProps } from '@aws-amplify/ui-react';
import { ReactNode } from 'react';

interface StackProps extends Omit<FlexProps, 'direction' | 'gap'> {
  children: ReactNode;
  spacing?: string;
}

interface SpacerProps {
  size?: string;
}

export function HStack({ children, spacing = "1rem", ...props }: StackProps) {
  return (
    <Flex direction="row" gap={spacing} alignItems="center" {...props}>
      {children}
    </Flex>
  );
}

export function VStack({ children, spacing = "1rem", ...props }: StackProps) {
  return (
    <Flex direction="column" gap={spacing} {...props}>
      {children}
    </Flex>
  );
}

export function Spacer({ size = "1" }: SpacerProps) {
  return <Flex flex={size} />;
}
