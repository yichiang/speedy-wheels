import React, { Component } from 'react'
import { Modal, Icon, Form, Header, Container, Divider, Grid, Button } from 'semantic-ui-react'
import SimpleForm  from './MyGoogleSuggest';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'semantic-ui-css/semantic.min.css';
import $ from 'jquery'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
const position = [51.505, -0.09];

class RequestForm extends Component {
  state = {showEmailAddress: false, showPhoneNumber: false, value:{}, open: false}
  constructor(props) {
     super(props);
    this.state = {showEmailAddress: false, showPhoneNumber: false, showResults: false, result: {}}
     this.onChangeOrigin = this.onChangeOrigin.bind(this);
     this.onChangeDestination = this.onChangeDestination.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.toggleEmailForm = this.toggleEmailForm.bind(this);
     this.toogleSubmitForm = this.toogleSubmitForm.bind(this);
   }
   handleChange = (e, { value }, nameTag) => {
     console.log("onchange", e, value,"name", e.target.name);
     var originalVal = this.state.value || {};
     var nameAtr = e.target.name || '';
     if(!nameAtr && nameTag){
       nameAtr = nameTag;
     }
     if(nameAtr){
       originalVal[nameAtr] = value;
       this.setState({ value: originalVal })
     }
   }

    getResponse = (lat, long) => {
      let constructed_url = "https://data.kingcounty.gov/resource/xhy5-rgaa.json?$where=intersects(the_geom, 'POINT ("
      constructed_url += long.toString()
      constructed_url += " "
      constructed_url += lat.toString()
      constructed_url += ")')"

      $.ajax({
        //https://data.seattle.gov/resource/n99g-k8uj.json?$where=intersects(the_geom,%20%27POINT%20(-122.4218242%2047.662893)%27)
        url: constructed_url,
        type: "GET",
        dataType: 'json',
        data: {
          "$limit" : 5000,
          "$$app_token" : "ZblfCkOVREKx1lb1pdaqTTYud"
        },
        success: function (data) {
          this.setState({result: data});
        }.bind(this)
      });
    }


    handleSubmit = (e, { value }) => {
      e.preventDefault();
      console.log("eva: e", e)
        console.log("eva: value", this.state.value)
        var self = this;
        if(this.state.showEmailAddress){
          console.log("sending request!");
          $.ajax({
            url: "http://localhost:4200/sendemail",
            type: "GET",
            data: {
              "$limit" : 5000,
              "$$app_token" : "ZblfCkOVREKx1lb1pdaqTTYud"
            }

          }).done(function(data) {
          });
          // this.toogleSubmitForm();
          this.setState({open: true});
        }
        var request = {}
        request.name = "Eva"
        request.origin = "4560 34th Ave S, Seattle, WA 98118"
        request.destination = "325 9th Ave, Seattle, WA 98104"
        request.age = 65
        request.date = "2017/10/02"
        request.time = "10:00:00"
        request.ifNeedReturn = true
        request.ifMedicalApt = false
        // console.log("eva: handleSubmit",this.getResponse(request))
    }
  toggleEmailForm(){
    this.setState({showEmailAddress: !this.state.showEmailAddress});
  }

  tooglePhoneForm(){
    this.setState({showPhoneNumber: !this.state.showPhoneNumber});
  }

  onChangeOrigin(data){
      console.log("onChangeDestination Data", data);
      console.log(this.state);
      var originalVal = this.state.value || {};
      originalVal["origin"] = data;
      this.setState({value:originalVal });
  }

  onChangeDestination(data){
      console.log("onChangeDestination Data", data);
      console.log(this.state);

      var originalVal = this.state.value || {};
      originalVal["destination"] = data;
      this.setState({value:originalVal });
  }
  // show =() => () => this.setState({  open: true })
 toogleSubmitForm (){
   this.setState({ open: false })
 }
  render() {
    const { value } = this.state
      return (
        <div>
        <div className="smallBox requestFormStylge">
        <div>
          <Header as='h2' icon='bus' content='Request Shuttle' textAlign="center" />
          <div className="textButtons">

          </div>
        </div>
        {!this.state.open &&
          <Form onSubmit={ (e, { value }) => {this.handleSubmit(e, { value });}}>
          <Divider horizontal>Basic Information</Divider>
          <Grid columns='two'>

              <Grid.Row>
                <Grid.Column>
                  <Form.Field>
                    <label>First Name</label>
                    <Form.Input placeholder='First name'  name="firstName" onChange={this.handleChange} />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column>
                  <Form.Field>
                    <label>Last Name</label>
                    <Form.Input placeholder='Last name'  name="lastname" onChange={this.handleChange} />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>Phone Number</label>
                  <Form.Input placeholder='Phone Number'  name="phonenumber" onChange={this.handleChange} />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            </Grid>
          <Divider horizontal></Divider>
            <label>Notifications</label>
              <Form.Radio label='Text' value='sm'  name="textR" checked={value === 'sm'} onChange={(e, { value }) => {this.handleChange(e, { value }); this.tooglePhoneForm()}} />
              <Form.Radio label='Phone Call' name="Phoner" value='lg' checked={value === 'lg'} onChange={(e, { value }) => {this.handleChange(e, { value }); this.tooglePhoneForm()}} />
              {this.state.showPhoneNumber&&
                <div>
                  <Form.Input label='' placeholder='Phone' name="phone" onChange={this.handleChange} />
                </div>
              }
              <Form.Radio label='Email' name="emailRadio" value='md' checked={value === 'md'} onChange={(e, { value }) => {this.handleChange(e, { value }); this.toggleEmailForm()}} />
              {this.state.showEmailAddress&&
                <div>
                  <Form.Input label='' placeholder='Email' name="email"  onChange={this.handleChange}/>
                </div>
              }

            <Form.Button>Submit</Form.Button>
            </Form>
        }
      </div>
      <div className="customerResult">

      </div>
      {this.state.open &&
        <div className="textModal">
          <Icon circular name='check' color="green" size='big' />
                Your Information Has been Sent.
                {this.state.value&& this.state.value.email &&
                  <div>You send email to {this.state.value.email}</div>
                }


              </div>
      }

      </div>
    );
  }
};

export default RequestForm;
