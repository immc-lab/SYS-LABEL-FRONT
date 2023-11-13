import { withCurrentAuth } from 'umi';
import React, { Component } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';


const ModelList = ()=> {

    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState;
    console.log(currentUser)
   

   
    
        return(
            <div>
                
               lala1
            </div>
            )
}

export default ModelList

