import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import MovieResults from './MovieResults.js'
import $ from 'jquery'

const API_KEY = "b539c36de3ac351990a2521409145810"
const IMG_API = "https://image.tmdb.org/t/p/w1280"

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {trendings: this.trending()}
    this.state = {selectedRadio: false}
    this.onChangeValue = this.onChangeValue.bind(this)
  }

  trending() {

    const topUrlString = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY

    $.ajax({
      url: topUrlString,
      success: (results) => {

        console.log("home page")
        const data = results.results

        var movieList = []

        data.forEach(movie => {

          movie.poster_path = IMG_API + movie.poster_path
          //movie.poster_path = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + movie.poster_path
          const movieEntry = <MovieResults key={movie.id} movie = {movie}/>
          movieList.push(movieEntry)
        });

        this.setState({movies: movieList})
      }
    })
  }

  getPersonDetails(actorId) {

    //const discoverUrl = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&with_cast=" + actorId
    const discoverUrl = "http://api.themoviedb.org/3/person/" + actorId + "/movie_credits?api_key=" + API_KEY

    $.ajax({

      url: discoverUrl,
      success: (discResults) => {

        console.log("successful")
        const personData = discResults.cast//discResults.results

        var allMovies = []

        personData.forEach(mov => {

          mov.poster_path = IMG_API + mov.poster_path
          const movieEntry = <MovieResults key={mov.id} movie = {mov}/>
          allMovies.push(movieEntry)
        });

        this.setState({movies: allMovies})

      }

    })

  }

  testFunc(movId) {
    /*const testUrl = "https://api.themoviedb.org/3/movie/" + movId + "?api_key=" + API_KEY
    
    $.ajax({

      url: testUrl,
      success: (res) => {

        console.log("in testFunc")
        const imdbId = res.imdb_id
        console.log(imdbId)
      }

    })*/
    const testUrl = "https://api.themoviedb.org/3/movie/" + movId + "/images?api_key=" + API_KEY
    
    $.ajax({

        url: testUrl,
        success: (res) => {

          const imgs = res.backdrops
          var backdrop_path = imgs[0].file_path
          console.log(backdrop_path)
        }
    })
  }

  searchBox(searchVal) {
    
    const searchUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + API_KEY + "&query=" + searchVal

    $.ajax({

      url: searchUrl,
      success: (searchResults) => {

        console.log("search successful")
        const data = searchResults.results
        var kf = data[0].known_for

        if (kf != null){

          var personId = data[0].id   // if search = person, get movies
        
          this.getPersonDetails(personId)
        }
        else {
          
          var movieList = []

          data.forEach(movie => {

            if (movie.media_type === "movie") {
              movie.poster_path = IMG_API + movie.poster_path
              const movieEntry = <MovieResults key={movie.id} movie = {movie}/>
              movieList.push(movieEntry)              
            }

          });

          this.setState({movies: movieList})
          this.setState({
            selectedRadio: false
          })
        }
      
      }

    })
  }


  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.searchBox(e.target.value)
      e.target.value = ""
    }
  }

  goHomePage = () => {
    this.trending()
    this.setState({
      selectedRadio: false
    })
  }

  handleClick() {
    console.log("Login button is clicked")
  }

  onChangeValue(event) {
    //console.log(event.target.value);
    console.log("Search by keyword")
    this.setState({
      selectedRadio: !this.state.selectedRadio
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">

          <button className="title" onClick={this.goHomePage}>movie.</button>
          <div className="buttons">
            <button className="login" type="submit" onClick={this.handleClick}>Login</button>
            <button className="signup" type="submit">Sign Up</button>
          </div>
          
          
        </header>
        
        <input className="Input-box" style={{
          width: "70%",
          fontSize: 18,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 8,
          marginTop: 10}} onKeyPress={this.handleKeyPress} placeholder="🔍︎ Search"/>

        <div className="keyword-button">
          <input type="radio" value="Keyword" name="keyword" onChange={this.onChangeValue} checked={this.state.selectedRadio}/> Keyword
        </div>
        

        <div className="content">
          {this.state.movies}
        </div>  

      </div>
    );
  }
}

export default App;
