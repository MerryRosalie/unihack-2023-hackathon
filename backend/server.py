from pydantic import BaseModel, UUID4
from starlite import Controller, Partial, get, post, put, patch, delete, Starlite


class User(BaseModel):
    first_name: str
    last_name: str
    id: UUID4

class UserController(Controller):
    path = "/users"

    @post()
    async def create_user(self, data: User) -> User:
        ...

    @get()
    async def list_users(self) -> list[User]:
        ...

    @patch(path="/{user_id:uuid}")
    async def partial_update_user(self, user_id: UUID4, data: Partial[User]) -> User:
        ...

    @put(path="/{user_id:uuid}")
    async def update_user(self, user_id: UUID4, data: User) -> User:
        ...

    @get(path="/{user_id:uuid}")
    async def get_user(self, user_id: UUID4) -> User:
        ...

app = Starlite(route_handlers=[UserController])