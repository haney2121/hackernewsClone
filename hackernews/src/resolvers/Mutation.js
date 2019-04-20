const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

//Post
const createPost = async (parent, args, context, info) => {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  })
}

//User Login
const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user }
}

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) return new Error('No such user found');

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) return new Error('Invalid Password');

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user }
}

//votes 
const vote = async (parent, args, context, info) => {
  const userId = getUserId(context)
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) return new Error(`Alread voted for link: ${args.linkId}`)
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  })
}

module.exports = { signup, login, createPost, vote };