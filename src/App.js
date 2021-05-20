import React from 'react';
import { useState, useEffect } from 'react'
import Testapp from './components/Testapp'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MyContext} from './ContextManager'

function App() {
  const [ifsuccess, changesuccess] = useState(false);

  return (
    <div className="App">
      <MyContext.Provider value={0}>
      <Testapp 
        ifsuccess = {ifsuccess} 
        onSuccess = {() => changesuccess(true)}
      />
      </MyContext.Provider>
    </div>
  );
}

export default App;

