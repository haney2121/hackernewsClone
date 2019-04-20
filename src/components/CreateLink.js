import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FEED_QUERY } from './LinkList';
import { LINKS_PER_PAGE } from '../constants';

const CREATEPOST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    createPost(description: $description, url: $url){
      id      
      url
      description
    }
  }
`;

const CreateLink = (props) => {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <Mutation mutation={CREATEPOST_MUTATION} variables={{ description, url }}
        onCompleted={() => props.history.push('/new/1')}
        update={(store, { data: { post } }) => {
          const first = LINKS_PER_PAGE
          const skip = 0
          const orderBy = 'createdAt_DESC'
          const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
          })
          data.feed.links.unshift(post)
          store.writeQuery({
            query: FEED_QUERY,
            data,
            variables: { first, skip, orderBy }
          })
        }}
      >
        {(PostMutation) => (
          <button onClick={PostMutation}>Submit</button>
        )}
      </Mutation>

    </div>
  )
}

export default CreateLink;