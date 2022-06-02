import React, { createContext, useState } from 'react';

interface PageContextInterface {
  name: string;
  setPageName: any;
}

export const PageContext = createContext<Partial<PageContextInterface>>({});

interface Props {
  children: React.ReactNode;
}

export const PageProvider = ({ children }: Props) => {
  const setPageName = (newName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setPageData((prevState) => {
      return {
        ...prevState,
        name: newName,
      };
    });
  };

  const samplePageContext: PageContextInterface = {
    name: ``,
    setPageName,
  };

  const [pageData, setPageData] =
    useState<PageContextInterface>(samplePageContext);

  return (
    <PageContext.Provider value={pageData}>{children}</PageContext.Provider>
  );
};
