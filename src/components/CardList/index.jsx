import React from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../constants/constants';
import Card from '../Card';
import styles from './styles.scss';

class CardList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
    };
  }

  componentDidMount() {
    axios.get(`${SERVER_URL}/api/v1/players`)
      .then((res) => res.data)
      .then((players) => Promise.all(
        players.map((player) => axios.get(`${SERVER_URL}/api/v1/players/${player.id}/data`)
          .then((res) => res.data)
          .then((datas) => Object.assign(player, { datas })),
        ),
      ))
      .then((players) => this.setState({ players }))
      .catch(e => {
        this.setState({ players: [] });
        console.error(e);
      });
  }

  renderCards() {
    return this.state.players.map(({ id, battle_tag, player_icon, datas }) => (
      <Card
        key={id}
        playerId={id}
        battleTag={battle_tag}
        playerIcon={player_icon}
        data={Array.isArray(datas) ? datas[0] : null}
      />
    ));
  }

  render() {
    return (
      <div className={styles.cardlist}>
        <div className={styles['card-area']}>
          { this.state.players.length > 0 ? this.renderCards() : <span>No cards</span>}
        </div>
      </div>
    );
  }
}

export default CardList;
