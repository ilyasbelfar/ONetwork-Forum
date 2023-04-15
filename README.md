# <p align="center">🌐 ONetwork Forum</p>

<p align="center"><img src="https://github.com/ilyasbelfar/ONetwork-Forum/blob/main/images/Capture_Forum.PNG" alt="ONetwork Forum Capture" style="max-width: 100% !important"></p>
<p align="center">✨🚀<em>Full-stack forum website built with MERN Stack (ReactJS, NodeJS, ExpressJS, MongoDB).</em>✨🚀</p>

[Live Demo](https://onetwork.ilyasbelfar.me)

---

### <p align="center">☄ Features ☄</p>

- User authentication using JSON Web Tokens (JWT) with BFF (Backend-For-Frontend) security pattern.
- Allow users to create, read and delete topics.
- Allow users to create, read and delete comments.
- Allow users to create, read and delete replies.
- Search engine for searching topics supported with sorting filters.
- Allow users to upvote and downvote topics and comments.
- Allow users to see their published comments, created topics, upvoted topics, their following list and their followers list.
- Allow users to reset their account password if they forgot it.
- Nested comments threading.
- Homepage feed (Front Page).
- Allow users to follow each other.
- Allow users to edit their profile informations and change their profile avatar and cover.
- Users can't access their account after signin-up till they activate it from the link sent to the email associated with their account.
- Sending users an email in case they request a password reset or an email verification.
- ... And more to come with next updates!
  <br>

---

## <p align="center">💻 Used Technologies 💻</p>

- ReactJS
- ExpressJS
- NodeJS
- MongoDB
- Redux
- Redux Toolkit
- React Bootstrap

---

## <p align="center">❓ How to use ❓</p>

<br>
<p align="center"><strong>1- Clone this repo.</strong></p>

```
git clone https://github.com/ilyasbelfar/ONetwork-Forum.git
cd ONetwork-Forum
```

<p align="center"><strong>2- Install Client dependencies.</strong></p>

```
cd client/
npm i
```

<p align="center"><strong>3- Install Server dependencies.</strong></p>

```
cd server/
npm i
```

<p align="center"><strong>4- Configure environment variables by creating .env file in the server directory and copy the content of env.example file in .env file, and fill it with your own secrets.</strong></p>

```
cd server/
cp env.example .env
```

<p align="center"><strong>5- Create a MongoDB database and name it 'my_app', You can use MongoDB Atlas cloud free tier.</strong></p>

<p align="center"><strong>6- Start server.</strong></p>

```
cd server/
npm start
```

<p align="center"><strong>7- Start client in another terminal while the server is running.</strong></p>

```
cd client/
npm start
```

---

## <p align="center">📌 Other 📌</p>

<br>
<p align="center">I encourages contributions! Feel free to discuss any bug fixes/features in the issues section. And if you wish to work on this project:</p>

1. Fork [this project](https://github.com/ilyasbelfar/ONetwork-Forum)
2. Create a branch (`git checkout -b new-branch`)
3. Commit your changes (`git commit -am 'add new feature'`)
4. Push to the branch (`git push origin new-branch`)
5. [Submit a pull request!](https://github.com/ilyasbelfar/ONetwork-Forum/pull/new/master)
