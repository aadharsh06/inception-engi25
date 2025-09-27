import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const HomePage = () => {
  return (
    <div className="flex flex-col w-screen h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">
          AI Assistant
        </Link>
        <div className="flex items-center space-x-4">
          {/* Placeholder for new chat button or other actions */}
          <Button variant="outline" size="sm">
            New Chat
          </Button>
          <Link to="/profile"> {/* This route will need to be defined later */} 
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Sessions */}
        <aside className="w-64 border-r border-border bg-card p-4 flex flex-col space-y-4 overflow-y-auto">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <div className="flex flex-col space-y-2">
            {/* Placeholder for session items */}
            <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Session 1</div>
            <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Session 2</div>
            <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Session 3</div>
          </div>
          <div className="mt-auto">
            <Button variant="secondary" className="w-full">
              Add New Session
            </Button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-background">
          {/* Chat messages display */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Placeholder for chat messages */}
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg max-w-md">Hello! How can I help you today?</div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-md">Build me a portfolio with high risk tolerance.</div>
            </div>
          </div>

          {/* Chat input */}
          <div className="p-4 border-t border-border bg-card flex items-center space-x-2">
            <Input
              className="flex-1 bg-background border-input"
              placeholder="Type your message..."
            />
            <Button>Send</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
