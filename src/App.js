// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load handpose DONE
// 6. Detect function DONE
// 7. Drawing utilities DONE
// 8. Draw functions DONE

import React, { useRef, useState, Component } from "react";
// import logo from './logo.svg';
// import * as tf from "@tensorflow/tfjs";
// import * as handpose from "@tensorflow-models/handpose";
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";

import * as handTrack from 'handtrackjs';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      swipe_arr: [],
      handclosed_arr: [],
      slide: 0,
      product_chosen:[0,0,0,0,0]
    }
    this.webcamRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  async componentDidMount(){
    let {swipe_arr, handclosed_arr, product_chosen} = this.state;
    const net =  await handTrack.load();
    //  Loop and detect hands
    setInterval(() => {
      if(this.state.handclosed_arr.length >= 20){
        product_chosen[this.state.slide] = !this.state.product_chosen[this.state.slide];
        this.setState({handclosed_arr:[], product_chosen: product_chosen})
      }
      if(this.state.swipe_arr.length >= 10){
        //console.log(this.state.swipe_arr)
        if(this.state.swipe_arr[9][0] !== undefined && this.state.swipe_arr[0][0] !== undefined){
          let dx = this.state.swipe_arr[9][0].bbox[0] - this.state.swipe_arr[0][0].bbox[0];
          let {slide} = this.state;
          //console.log('Delta X:', dx)
          if(dx <= 0){
            if(slide === 4)
              this.setState({slide: 0})
            else
              this.setState({slide: this.state.slide+1})
          } else {
            if(slide === 0)
              this.setState({slide: 4})
            else
              this.setState({slide: this.state.slide-1})
          }
        }
        this.setState({swipe_arr:[]})
      }
      else 
        this.detect(net).then(prediction => {
          if(prediction !== undefined && prediction[0] !== undefined){
            if(prediction[0].label === 'open')
              this.setState({swipe_arr:[...this.state.swipe_arr, prediction]})
            else if(prediction[0].label === 'closed')
              this.setState({handclosed_arr:[...this.state.handclosed_arr, prediction]})
          }
        })
    }, 100);
  }

  renderCarousel(){
    let {product_chosen} = this.state;
    return(
      <Carousel activeIndex={this.state.slide}>
        <Carousel.Item>
          <Card border={product_chosen[0] ? "success" : ''}>
            <Card.Img variant="top" src="images/coffee-cup.png" style={{height:300, width:230, marginLeft:'auto', marginRight:'auto', paddingTop:25, paddingBottom:25}} />
            <Card.Body>
              <Card.Text style={{fontSize:20}}> 
                Coffee
              </Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card border={product_chosen[1] ? "success" : ''}>
            <Card.Img variant="top" src="images/french-fries.png" style={{height:300, width:230, marginLeft:'auto', marginRight:'auto', paddingTop:25, paddingBottom:25}} />
            <Card.Body>
              <Card.Text style={{fontSize:20}}>
                French fries
              </Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card border={product_chosen[2] ? "success" : ''}>
            <Card.Img variant="top" src="images/can.png" style={{height:300, width:230, marginLeft:'auto', marginRight:'auto', paddingTop:25, paddingBottom:25}} />
            <Card.Body>
              <Card.Text style={{fontSize:20}}>
                Soda
              </Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card border={product_chosen[3] ? "success" : ''}>
            <Card.Img variant="top" src="images/cheeseburger.png" style={{height:300, width:230, marginLeft:'auto', marginRight:'auto', paddingTop:25, paddingBottom:25}} />
            <Card.Body>
              <Card.Text style={{fontSize:20}}>
                Cheeseburger
              </Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card border={product_chosen[4] ? "success" : ''}>
            <Card.Img variant="top" src="images/ice-cream.png" style={{height:300, width:230, marginLeft:'auto', marginRight:'auto', paddingTop:25, paddingBottom:25}} />
            <Card.Body>
              <Card.Text style={{fontSize:20}}>
                Ice cream
              </Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
      </Carousel>
    )
  }

  async detect(net) {
    // Check data is available
    if (
      typeof this.webcamRef.current !== "undefined" &&
      this.webcamRef.current !== null &&
      this.webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = this.webcamRef.current.video;
      const videoWidth = this.webcamRef.current.video.videoWidth;
      const videoHeight = this.webcamRef.current.video.videoHeight;

      // Set video width
      this.webcamRef.current.video.width = videoWidth;
      this.webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      this.canvasRef.current.width = videoWidth;
      this.canvasRef.current.height = videoHeight;

      const predictions = await net.detect(video);

      // Draw mesh
      const ctx = this.canvasRef.current.getContext("2d");
      drawHand(predictions, ctx);

      return predictions;
    }
  };

  render(){
    let index2name = {
      0: 'Coffee',
      1: 'French fries',
      2: 'Soda',
      3: 'Cheeseburger',
      4: 'Ice Cream',
    }
    return (
      <div className="App">
        <header className="App-header">
          <Webcam
            ref={this.webcamRef}
            style={{
              position: "absolute",
              marginRight: "auto",
              left: 0,
              bottom:0,
              textAlign: "center",
              zindex: 9,
              width: 300,
              height: 230,
            }}
          />
  
          <canvas
            ref={this.canvasRef}
            style={{
              position: "absolute",
              marginRight: "auto",
              left: 0,
              bottom:0,
              textAlign: "center",
              zindex: 9,
              width: 300,
              height: 230,
            }}
          />

        <Container fluid className="mb-5">
          <Row className="d-flex justify-content-center">
            Please, choose the desired products
          </Row>
        </Container>
        <Container>
          <Row>
            {this.renderCarousel()}
          </Row>
        </Container>
        <Container fluid className="mt-5">
          <Row className="d-flex justify-content-center">
            Products selected: {this.state.product_chosen.map((prod, index) => prod ? index2name[index]+', ' : '')}
          </Row>
        </Container>

        </header>
      </div>
    );
  }
}

export default App;