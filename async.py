import asyncio
import aioconsole

async def get_user_input():
    name = await aioconsole.ainput("Veuillez entrer votre nom : ")
    print(f"Bonjour, {name}!")

async def long_running_task():
    print("Démarrage de l'opération longue...")
    await asyncio.sleep(5)  # Simule une opération longue
    print("Opération longue terminée.")

async def main():
    await asyncio.gather(
        get_user_input(),
        long_running_task()
    )

if __name__ == "__main__":
    asyncio.run(main())
