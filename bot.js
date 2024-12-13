const mineflayer = require('mineflayer')
const express = require('express')

// Create a simple express server to keep the repl alive
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Minecraft bot is running!')
})

app.listen(port, () => {
  console.log(`Web server running on port ${port}`)
})

// Bot configuration
const botConfig = {
  host: 'NeonxKhokhar-59Ij.aternos.me',
  port: 15281,
  username: 'JD',
  auth: 'offline',  // For cracked servers
  keepAlive: true,  // Enable keep alive packets
  checkTimeoutInterval: 30000  // Check connection every 30 seconds
}

function createBot() {
  // Create bot instance
  const bot = mineflayer.createBot(botConfig)

  // Handle errors
  bot.on('error', (err) => {
    console.log('Error:', err)
    setTimeout(createBot, 5000)  // Try to reconnect after 5 seconds
  })

  // Handle kicked events
  bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason)
    setTimeout(createBot, 5000)
  })

  // Handle disconnected events
  bot.on('disconnect', (reason) => {
    console.log('Bot disconnected:', reason)
    setTimeout(createBot, 5000)
  })

  // Handle spawn event
  bot.on('spawn', () => {
    console.log('Bot spawned')
    
    // Set up anti-timeout measures
    setInterval(() => {
      // Look around randomly to show activity
      bot.look(Math.random() * Math.PI * 2, Math.random() * Math.PI - (Math.PI / 2))
      
      // Small jump occasionally
      if (Math.random() < 0.3) {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 100)
      }
      
      // Send a chat message every 5 minutes
      if (Math.random() < 0.1) {
        bot.chat("I'm still here!")
      }
    }, 10000)  // Perform actions every 10 seconds
  })

  // Handle death and auto respawn
  bot.on('death', () => {
    console.log('Bot died, respawning...')
    bot.chat('/respawn')  // Some servers require this command
  })

  // Handle when bot is ready
  bot.once('spawn', () => {
    console.log('Bot successfully connected to the server!')
  })

  return bot
}

// Start the bot
createBot()
