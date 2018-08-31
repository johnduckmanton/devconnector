/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import React from 'react';

export default () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      Copyright &copy; {new Date().getFullYear()} John Duckmanton
    </footer>
  );
};
