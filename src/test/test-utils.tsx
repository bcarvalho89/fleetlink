/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(createTestQueryClient);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options?: RenderOptions) => {
  const { wrapper: Wrapper, ...restOptions } = options || {};
  const finalWrapper = Wrapper
    ? ({ children }: { children: React.ReactNode }) => (
        <AllTheProviders>
          <Wrapper>{children}</Wrapper>
        </AllTheProviders>
      )
    : AllTheProviders;

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: finalWrapper, ...restOptions }),
  };
};

const customRenderHook = <TResult, TProps>(
  renderCallback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
) => {
  return renderHook(renderCallback, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };
