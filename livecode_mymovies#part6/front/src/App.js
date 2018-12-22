import React, {Component} from 'react'; // Import de React et de son élément "Component"
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'; // Obligatoire pour utiliser bootstrap
import {
  Container,
  Col,
  Row,
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Nav,
  NavLink,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' // Obligatoire pour utiliser fontawesome avec React
import {faHeart} from '@fortawesome/free-solid-svg-icons' // Il faut spécifier chaque icons que l'on souhaite récupérer

class App extends Component {
  // Popover Reactstrap -----
  constructor(props) {
    super(props);

    // On injecte this dans nos fonctions grace à la méthode "bind"
    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickLikeOn = this.handleClickLikeOn.bind(this);
    this.handleClickLikeOff = this.handleClickLikeOff.bind(this);
    this.state = {
      popoverOpen: false,
      viewOnlyLike: false, // Permet de voir uniquement les Movies likés
      moviesCount: 0, // Nombre de films likés (dans le compteur)
      moviesNameList: [], // Tableau qui contient tous les films likés
      movies: [],
      moviesLiked: [],
      status: null
    };
  }

  componentWillMount() {
    this.setState({
      status: 'API is processing ...'
    });
  };

  componentDidMount() {
    // var ctx = this; // Si ES5
    fetch('http://localhost:3000/movies').then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({movies: data.movieList, status: null});
    }).catch((error) => {
      console.error(error);
    });

    fetch('http://localhost:3000/mymovies').then((response) => {
      return response.json();
    }).then((data) => {
      var moviesNameListCopy = data.movies.map(function(movie) {
        return movie.title;
      });
      this.setState({
        moviesLiked: data.movies,
        moviesCount: data.movies.length,
        moviesNameList: moviesNameListCopy
      });
      console.log(this.state.moviesLiked);
    }).catch((error) => {
      console.error(error);
    });
  };

  // Création d'une fonction acceptant 2 arguments (ici "isLike" et "name")
  handleClick(isLike, name) {
    var moviesNameListCopy = [...this.state.moviesNameList]; // "Je déverse l'état de mon state dans une variable, parce que c'est un tableau"
    if (isLike) {
      moviesNameListCopy.push(name);
      // Incrémente l'état "moviesCount" et on ajoute le titre du film liké dans "moviesNameList"
      this.setState({
        moviesCount: this.state.moviesCount + 1,
        moviesNameList: moviesNameListCopy
      });
    } else {
      var index = moviesNameListCopy.indexOf(name); // On recherche l'index de name dans le tableau moviesNameListCopy
      moviesNameListCopy.splice(index, 1); // On supprime l'élément trouvé
      // Décrément l'état "moviesCount" et on supprime le titre du film déliké dans "moviesNameList"
      this.setState({
        moviesCount: this.state.moviesCount - 1,
        moviesNameList: moviesNameListCopy
      });
    }
  }

  handleClickLikeOn() {
    // Change l'état de viewOnlyLike à true (pour afficher les films uniquements likés)
    this.setState({
      viewOnlyLike: true
    });
  }

  handleClickLikeOff() {
    // Change l'état de viewOnlyLike à false (pour afficher tous les derniers films)
    this.setState({
      viewOnlyLike: false
    });
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }
  // --------

  render() {
    // const moviesData = [
    //   {
    //     name: 'L\'Odyssée de Pi',
    //     desc: ' Après que leur bateau est victime d\'une violente tempête et coule au fond du Pacifique, un adolescent et un tigre du Bengale ...',
    //     img: '/pi.jpg'
    //   }, {
    //     name: 'Maléfique',
    //     desc: 'Poussée par la vengeance et une volonté farouche deprotéger les terres qu\'elle préside, Maléfique place ...',
    //     img: '/malefique.jpg'
    //   }, {
    //     name: 'Les Aventures de Tintin',
    //     desc: 'Parce qu\'il achète la maquette d\'un bateau appelé laLicorne, Tintin, un jeune reporter, se retrouve entraîné dans unefantastique aventure ...',
    //     img: '/tintin.jpg'
    //   }, {
    //     name: 'L\'Odyssée de Pi',
    //     desc: ' Après que leur bateau est victime d\'une violente tempête et coule au fond du Pacifique, un adolescent et un tigre du Bengale ...',
    //     img: '/pi.jpg'
    //   }, {
    //     name: 'Maléfique',
    //     desc: 'Poussée par la vengeance et une volonté farouche deprotéger les terres qu\'elle préside, Maléfique place ...',
    //     img: '/malefique.jpg'
    //   }, {
    //     name: 'Les Aventures de Tintin',
    //     desc: 'Parce qu\'il achète la maquette d\'un bateau appelé laLicorne, Tintin, un jeune reporter, se retrouve entraîné dans unefantastique aventure ...',
    //     img: '/tintin.jpg'
    //   }
    // ];

    var ctx = this; // On donne à ctx la valeur de this (du Composant App), pour pouvoir l'utiliser dans le map (qui a un "this" différent)
    // Génère un tableau "movieList" contenant chacun des films
    // On passe en propriétés "movieName", "movieDesc", "movieImg" contenants chacun ses valeurs respectives
    var movieList = this.state.movies.map(function(movie, i) {
      var isLiked = false;
      for (var j = 0; j < ctx.state.moviesLiked.length; j++) {
        if (ctx.state.moviesLiked[j].idMovieDB === movie.id) {
          isLiked = true;
          break;
        }
      }
      return <Movies key={i} isLiked={isLiked} movieId={movie.id} movieName={movie.title} movieDesc={movie.overview} movieImg={movie.poster_path} displayOnlyLike={ctx.state.viewOnlyLike} handleClickParent={ctx.handleClick}/>;
    });

    // Génère un tableau "moviesNameList" contenant tous les noms des films
    // var moviesNameList = moviesData.map(function(movie) {
    //   return movie.name;
    // });
    // console.log(moviesNameList);

    // Création d'une variable moviesLast contenant les 3 derniers éléments du tableau "this.props.moviesNameList"
    var moviesLast = this.state.moviesNameList.slice(-3);

    // la méthode "join()" sert à concaténer chaque élément d'un tableau, et permet aussi d'y rajouter des caractères entre
    // tableau.join(', ') rajoute une virgule et un espace entre chaque élément, sauf le dernier
    if (this.state.moviesCount === 0) {
      moviesLast = "aucun film sélectionné";
    } else if (this.state.moviesCount > 3) {
      moviesLast = moviesLast.join(', ') + '...';
    } else {
      moviesLast = moviesLast.join(', ') + '.';
    }

    // Condition ternaire : "condition ? true : false"
    /* Si moviesCount est supérieur à 1 ?
        (true) On écrit "films" :
        (false) Sinon "film"
    */

    // Avec Reactstrap, on remplace nos classes "container", "Row" et "Col" par des balises <Container>, <Row> et <Col>
    return (<Container>
      {/* Appel du composant Header avec passage de propriétés moviesCount et moviesNameList */}
      <Nav style={styles.navMargin}>
        <img src="logo.png" alt="logo movie"/>
        <NavLink href="#" style={styles.colorWhite} onClick={this.handleClickLikeOff}>Last releases</NavLink>
        <NavLink href="#" style={styles.colorWhite} onClick={this.handleClickLikeOn}>My Movies</NavLink>
        <Button id="Popover1" onClick={this.toggle}>
          {this.state.moviesCount} {this.state.moviesCount > 1 ? 'films' : 'film'}
        </Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverHeader>Derniers films ajoutés</PopoverHeader>
          <PopoverBody>{moviesLast}</PopoverBody>
        </Popover>
      </Nav>
      <h1 style={{color: '#F3F3F3'}}>{this.state.status}</h1>
      <Row>
        {/* Appel de movieList */}
        {movieList}
      </Row>
    </Container>);
  }
}

class Movies extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      like: this.props.isLiked
    };
  }

  handleClick() {
    var isLike = !this.state.like;
    this.setState({
      like: isLike
    });
    if (isLike) {
      // Je veux poster un film
      fetch('http://localhost:3000/mymovies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `title=${this.props.movieName}&overview=${this.props.movieDesc}&poster_path=${this.props.movieImg}&idMovieDB=${this.props.movieId}`
      }).catch((error) => {
        console.error(error);
      });
    } else {
      // Je veux supprimer un film
      fetch(`http://localhost:3000/mymovies/${this.props.movieId}`, {method: 'DELETE'}).catch((error) => {
        console.error(error);
      });
    };
    console.log('clic détecté', isLike);
    this.props.handleClickParent(isLike, this.props.movieName); // J'appelle la fonction contenue dans mon parent avec 2 paramètres (liké ou non, et le nom du film)
  }

  // Revient à faire ça :
  /* async handleClick() {
    await this.setState({
      like: !this.state.like
    });
    console.log('clic détecté', this.state.like);
  } */

  render() {
    // On redéclare notre style qui sera utilisé sur le coeur, pour pouvoir le modifier en dynamique
    var colorHeart = {
      color: 'grey',
      position: 'absolute',
      top: '3%',
      right: '5%',
      height: 30,
      width: 30
    };

    if (this.state.like) {
      colorHeart.color = '#FF5B53';
    }

    var isDisplay = {
      marginBottom: 15
    };

    // Si l'état like est "false" ET QUE displayOnlyLike est "true", on cache le composant Movie sur lequel on est
    if (!this.state.like && this.props.displayOnlyLike) {
      isDisplay.display = 'none';
    }

    // Pour les Colonnes responsives, on met directement "xs", "sm", "md", "xl" et "lg" suivi d'un égal et du nombre de colonnes que doit prendre notre élément (entre guillemets)
    return (<Col xs="12" sm="6" lg="3" style={isDisplay}>
      <Card>
        {/* top est un élémént booléen, il peut être spécifié seul, ou suivi d'un ={true} */
        }
        <CardImg top={true} width="100%" src={`https://image.tmdb.org/t/p/w500${this.props.movieImg}`} alt="Card image cap"/>
          <CardBody style={styles.cardHeight}>
            <CardTitle>{this.props.movieName.substr(0, 20) + ' ...'}</CardTitle>
            <CardText>{this.props.movieDesc.substr(0, 80) + ' ...'}</CardText>
          </CardBody>
          {/* Appel de l'icone fontawesome en utilisant une balise autofermante FontAwesomeIcon (élément importé tout en haut du code) */
        }
        <FontAwesomeIcon icon={faHeart} style={colorHeart} onClick={this.handleClick}/>
      </Card>
    </Col>);
  }
}

// Déclaration d'un objet styles contenant tout le style de nos composants présents dans le fichier
var styles = {
  navMargin: {
    marginBottom: 10,
    paddingTop: 5
  },
  colorWhite: {
    color: 'white'
  },
  cardHeight: {
    height: 200
  }
};

// export default (toujours présent)
export default App;
