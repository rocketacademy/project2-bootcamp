import React from 'react'
import {push, ref, set} from 'firebase/database'
import { realTimeDatabase} from '../firebase'

export default class MOMForm extends React.Component{
  constructor(){
    super()

    this.state = {
      name:'',
      description:''
    }
  }

  render(){
    return (
      <div>
        <h1>Form</h1>
      </div>
    )
  }
}