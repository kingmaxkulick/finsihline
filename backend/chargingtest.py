import threading
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import keyboard
import os
import cantools  # Added for DBC parsing

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load DBC file
DBC_FILE_PATH = r"C:\Users\MaxKulick\Documents\finsihline-main\backend\INV_CAN_cm.dbc"

try:
    # Initialize the database
    dbc = cantools.database.Database()
    dbc.add_dbc_file(DBC_FILE_PATH)
    print(f"✅ Loaded DBC file: {DBC_FILE_PATH}")
    
    # Get all valid CAN IDs from the database
    valid_can_ids = {msg.frame_id: msg.name for msg in dbc.messages}
    print(f"✅ Available CAN Messages: {len(valid_can_ids)}")
    
    # Find the Inverter State message and signal
    INV_STATE_KEY = "M170_Internal_States.INV_Inverter_State"
    print(f"✅ Using inverter state key: {INV_STATE_KEY}")
    
except Exception as e:
    print(f"❌ Error loading DBC file {DBC_FILE_PATH}: {e}")
    print("Continuing with default key...")
    INV_STATE_KEY = "M170_Internal_States.INV_Inverter_State"

# Global state
current_state = 8

# Create mock vehicle data
vehicle_data = {
    INV_STATE_KEY: current_state
}

# Endpoint to get vehicle data
@app.get("/vehicle_data")
async def get_vehicle_data():
    global vehicle_data
    return vehicle_data

# Function to toggle the inverter state
def toggle_state():
    global current_state, vehicle_data
    
    # Toggle between 8 and 9
    current_state = 9 if current_state != 9 else 8
    
    # Update the data
    vehicle_data[INV_STATE_KEY] = current_state
    
    print(f"🔄 Toggled inverter state to {current_state}")

# Function to handle key presses
def handle_keys():
    print("==== Inverter State Toggler ====")
    print("Press 'I' to toggle inverter state between 8 and 9")
    print("Press 'Q' to quit")
    
    # Register key press events
    keyboard.on_press_key("i", lambda _: toggle_state())
    keyboard.on_press_key("q", lambda _: quit_app())
    
    # Keep running until told to exit
    try:
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("\nExiting...")

def quit_app():
    print("\nExiting...")
    os._exit(0)

# Start the FastAPI server in a separate thread
def start_server():
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="warning")

if __name__ == "__main__":
    # Start the server in a separate thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Handle key presses in the main thread
    handle_keys()