const { UserInputError, AuthenticationError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const Author = require('../models/author');
const Book = require('../models/book');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorsCount: () => {
      return Author.collection.countDocuments();
    },
    allBooks: async() => {
      let book = await Book.find({}).populate('author', {name: 1});
      const arr = [];
      let newBook = [ ...JSON.parse(JSON.stringify(book))];
      for (let i = 0; i < newBook.length; i++) {
        newBook[i].author = newBook[i].author.name
        newBook[i]['id'] = newBook[i]['_id']
        arr.push(newBook[i])
      }
      return arr;
    },
    allAuthors: async() => {
      const books = await Book.aggregate([
        {
          $group: {_id: '$author', count:{$sum: 1}},
        },
        {$project: {author: '$_id', count: 1, _id: 0}}
      ])
      const authors = await Author.find({});

      const arr = [];

      for(let i = 0; i < books.length; i++) {
        let newAuthor = authors.find(author => author._id.toString() === books[i].author.toString());
        arr.push({author: newAuthor.name, born: newAuthor.born, bookCount: books[i].count})
      }

      return arr;
    },
    allAuthorBooks: async(root, args) => {
      if (!args.author && args.genre) {
        let book = await Book.find({genres: {$in: [args.genre]}}).populate('author', {name: 1});
        const arr = [];
        let newBook = [ ...JSON.parse(JSON.stringify(book))];
        for (let i = 0; i < newBook.length; i++) {
          newBook[i].author = newBook[i].author.name
          arr.push(newBook[i])
        }
        return arr.length > 1 ? arr : null;
      } else if (args.author && !args.genre) {
        let author = await Author.findOne({name: args.author});
        if (author) {
          let book = await Book.find({author: author.id}).populate('author', {name: 1});
          const arr = [];
          let newBook = [ ...JSON.parse(JSON.stringify(book))];
          for (let i = 0; i < newBook.length; i++) {
            newBook[i].author = newBook[i].author.name
            arr.push(newBook[i])
          }
          return arr;
        }
        return null;
      } else if (args.author && args.genre) {
        let author = await Author.findOne({name: args.author});
        if (author) {
          let book = await Book.find({
            genres: {$in: [args.genre]},
            author: author.id
          }).populate('author', {name:1});
          const arr = [];
          let newBook = [ ...JSON.parse(JSON.stringify(book))];
          for (let i = 0; i < newBook.length; i++) {
            newBook[i].author = newBook[i].author.name;
            arr.push(newBook[i]);
          }
          return arr;
        }
        return null;
      } else {
        let book = await Book.find({}).populate('author', {name: 1});
        let newBook = [...JSON.parse(JSON.stringify(book))];
        let arr = [];
        for (let i = 0; i < newBook.length; i++) {
          newBook[i].author = newBook[i].author.name;
          arr.push(newBook[i]);
        }
        return arr;
      }
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials");
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You are not authorized to perform task');
      }
      if (await Book.findOne({title: args.title})) {
        throw new UserInputError('Title must be unique', {
          invalidArgs: args.name,
        })
      } else if (args.author.length < 5) {
        throw new UserInputError('Author name must be up to 5 characters', {
          invalidArgs: args.name,
        })
      }
      let authorId;
      if (authorId = await Author.findOne({name: args.author})) {
        authorId = authorId;
      } 
      else {
        let newAuthor = new Author({name: args.author});
        authorId = await newAuthor.save();
      }
      
      let newBook = new Book({...args, author: authorId.id});
      await newBook.save();
      console.log({...JSON.parse(JSON.stringify(newBook)), author: authorId.name, id: newBook._id})
      pubsub.publish('BOOK_ADDED', { bookAdded: {...JSON.parse(JSON.stringify(newBook)), author: authorId.name, id: newBook._id} });
      return {...JSON.parse(JSON.stringify(newBook)), author: authorId.name, id: newBook._id};
    },
    editAuthor: async(root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You are not authorized to perform task');
      }
      const oldAuthor = await Author.findOne({name: args.name});
      if (oldAuthor) {
        const newAuthor = {...args};
        return Author.findByIdAndUpdate(oldAuthor._id, newAuthor, { new: true });
      }   
      return null;
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

module.exports = resolvers;