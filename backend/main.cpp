#include <iostream>
#include <vector>
#include <random>
#include <ctime>
#include <string>
#include <map>

using namespace std;

// Game constants
const int BOARD_WIDTH = 20;
const int BOARD_HEIGHT = 20;
const int INITIAL_SNAKE_LENGTH = 3;

// Direction enum
enum class Direction { UP, DOWN, LEFT, RIGHT };

// Game state structure
struct GameState {
    vector<pair<int, int>> snake; // Snake body segments (x,y)
    Direction direction;         // Current movement direction
    pair<int, int> food;         // Food position
    int score;                   // Current score
    bool gameOver;               // Game over flag
    string playerName;           // Player name
};

class SnakeGame {
private:
    GameState state;
    mt19937 rng;

public:
    SnakeGame() : rng(time(nullptr)) {
        resetGame("Player");
    }

    // Reset the game to initial state
    void resetGame(const string& playerName) {
        state.snake.clear();
        state.direction = Direction::RIGHT;
        state.score = 0;
        state.gameOver = false;
        state.playerName = playerName;

        // Initialize snake in the center of the board
        int startX = BOARD_WIDTH / 2;
        int startY = BOARD_HEIGHT / 2;
        for (int i = 0; i < INITIAL_SNAKE_LENGTH; ++i) {
            state.snake.emplace_back(startX - i, startY);
        }

        // Place initial food
        placeFood();
    }

    // Place food at random position
    void placeFood() {
        uniform_int_distribution<int> distX(0, BOARD_WIDTH - 1);
        uniform_int_distribution<int> distY(0, BOARD_HEIGHT - 1);

        do {
            state.food.first = distX(rng);
            state.food.second = distY(rng);
        } while (isPositionOnSnake(state.food.first, state.food.second));
    }

    // Check if position is occupied by snake
    bool isPositionOnSnake(int x, int y) {
        for (const auto& segment : state.snake) {
            if (segment.first == x && segment.second == y) {
                return true;
            }
        }
        return false;
    }

    // Update game state (move snake)
    void update() {
        if (state.gameOver) return;

        // Get head position
        auto head = state.snake.front();
        int newX = head.first;
        int newY = head.second;

        // Calculate new head position based on direction
        switch (state.direction) {
            case Direction::UP:    newY--; break;
            case Direction::DOWN:  newY++; break;
            case Direction::LEFT:  newX--; break;
            case Direction::RIGHT: newX++; break;
        }

        // Check for collisions with walls
        if (newX < 0 || newX >= BOARD_WIDTH || newY < 0 || newY >= BOARD_HEIGHT) {
            state.gameOver = true;
            return;
        }

        // Check for collisions with self (except tail which will move)
        for (size_t i = 0; i < state.snake.size() - 1; ++i) {
            if (state.snake[i].first == newX && state.snake[i].second == newY) {
                state.gameOver = true;
                return;
            }
        }

        // Move snake
        state.snake.insert(state.snake.begin(), {newX, newY});

        // Check if food was eaten
        if (newX == state.food.first && newY == state.food.second) {
            state.score += 10;
            placeFood();
        } else {
            // Remove tail if no food was eaten
            state.snake.pop_back();
        }
    }

    // Change snake direction
    void setDirection(Direction newDirection) {
        // Prevent 180-degree turns
        if ((state.direction == Direction::UP && newDirection != Direction::DOWN) ||
            (state.direction == Direction::DOWN && newDirection != Direction::UP) ||
            (state.direction == Direction::LEFT && newDirection != Direction::RIGHT) ||
            (state.direction == Direction::RIGHT && newDirection != Direction::LEFT)) {
            state.direction = newDirection;
        }
    }

    // Get current game state (for API response)
    map<string, string> getGameState() const {
        map<string, string> result;
        result["score"] = to_string(state.score);
        result["gameOver"] = state.gameOver ? "true" : "false";
        result["playerName"] = state.playerName;
        
        // Serialize snake positions
        string snakeStr;
        for (const auto& segment : state.snake) {
            snakeStr += to_string(segment.first) + "," + to_string(segment.second) + ";";
        }
        if (!snakeStr.empty()) snakeStr.pop_back(); // Remove last semicolon
        result["snake"] = snakeStr;
        
        // Serialize food position
        result["food"] = to_string(state.food.first) + "," + to_string(state.food.second);
        
        return result;
    }

    // Get raw game state (for internal use)
    const GameState& getRawGameState() const {
        return state;
    }
};

// Example of how this could be integrated with a web framework
int main() {
    // This would be replaced by actual web framework integration
    SnakeGame game;
    
    cout << "Starting Snake Game..." << endl;
    
    // Simulate a game loop (in a real web app, this would be triggered by client requests)
    for (int i = 0; i < 50; ++i) {
        // In a real app, direction would come from client input
        if (i == 5) game.setDirection(Direction::DOWN);
        if (i == 15) game.setDirection(Direction::RIGHT);
        if (i == 25) game.setDirection(Direction::UP);
        
        game.update();
        
        // Get game state to send to client
        auto state = game.getGameState();
        
        // Print state (in a real app, this would be JSON sent to client)
        cout << "Turn " << i << ": ";
        cout << "Score: " << state["score"] << ", ";
        cout << "Game Over: " << state["gameOver"] << endl;
        cout << "Snake: " << state["snake"] << endl;
        cout << "Food: " << state["food"] << endl;
        
        if (state["gameOver"] == "true") {
            cout << "Game Over!" << endl;
            break;
        }
    }
    
    return 0;
}