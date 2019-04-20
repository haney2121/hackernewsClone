import React from 'react';
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

const Link = (props) => {
  const { index, updateCacheAfterVote } = props;
  const { description, url, votes, postedBy, createdAt, id } = props.link;

  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation mutation={VOTE_MUTATION} variables={{ linkId: id }} update={(store, { data: { vote } }) => updateCacheAfterVote(store, vote, id)}>
            {voteMutation => (
              <div className="ml1 gray f11 pointer" onClick={voteMutation}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        {description} (<a href={url} target="_blank" rel="noopener noreferrer">{url}</a>)
      </div>
      <div style={{ margin: '0 0 0 10px' }} className="f6 lh-copy gray">
        {votes.length} votes | by {' '}
        {postedBy ? postedBy.name : 'Unknown'}{' '}
        {timeDifferenceForDate(createdAt)}
      </div>
    </div>
  )
}

export default Link;