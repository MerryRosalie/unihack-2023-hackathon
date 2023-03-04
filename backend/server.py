from starlite import Starlite

from controllers.user import UserController

app = Starlite(route_handlers=[UserController])
