### React Native Routing
A declarative router for React Native apps supporting

1. Pre-rendering routes ahead of their usage
2. Caching routes for faster navigations to already-visited-screens
3. Dynamically declared routes - securily disable/enable routes at runtime 
4. Animations between screens

This library is currently being developed to optimize React Native views for a specific application. It's stable enough to be used in production, but please expect breaking changes in coming releases.

### Why another Routing library
Most routers for react native have one common performance pitfall when rendering data-heavy or complex screens. That pitfall is the speed at which React Native can render a view from scratch. This library provides options for caching and reusing screens that'll speed up that work at the cost of a little bit of extra memory.

### Declaring Routes
To begin declaring routes, wrap your desired UI in a `<Navigation />` component. Next, wrap your individual `<Route />` components in a `<Routes />` container. 
```tsx
import { Navigation, Routes, Route, Redirect } from "react-native-routing";

export const MyApp = () => {
  return (
    <Navigation>
      <View style={Styles.container}>
        <Routes transition="slide-x">
          <Route path="/" Component={LazyComponent} />
          <Route path="/screen1" Component={LazyComponent1} />
          <Route path="/screen2" Component={LazyComponent2} />
          <Route path="/screen3" Component={LazyComponent3} />
          <Route path="/screen4" Component={LazyComponent4} />
          <Route path="/*" element={<Redirect to="/" />} />
        </Routes>
      </View>
    </Navigation>
  );
}
```
You can nest additional `<Routes />` inside of the components that you pass to a given `<Route />` allowing for dynamic nested routing. Only one `<Navigation />` component is necessary though.

You may have noticed above that we wrapped our `<Routes />` component in a `<View />`. This library (for now) renders all `<Routes />` with `position` set to `absolute`, so that containing view is typically a wrapper with `position` set to `relative` and a height/width that create the boundaries for each of your rendered screens.

### Exposing Your App's Router
In most routing libraries, gaining access to your `Router` requires using a hook or HOC inside of a react component. This is **not** the case with this library. You can delcare your router anywhere in your application and use it in non-react-native logic simply by importing it:

```tsx
import { Navigation, Routes, Router } from "react-native-routing";

const MyAppRouter = new Router(/* base route (defaults to "/") */)

export const MyApp = () => {
  return (
    <Navigation router={MyAppRouter}>
      <View style={Styles.container}>
        <Routes transition="slide-x">
          {/* Your routes */}
        </Routes>
      </View>
    </Navigation>
  );
}
```
In any business logic you are then free to import `MyAppRouter` and use its `navigate` method to direct the user to any route(s) you wish.

### Hooks
While exposing the internal `Router` is useful for some applications, others may wish to stick to more traditional react hooks to interact with the `Router`.

#### useNavigate
Exposes the `navigate` function of the current router
```tsx
import { useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigate } from "react-native-routing";

const MyNavLink = ({ path, label }: { path: string, label: string }) => {
  const navigate = useNavigate();
  const navigateTo = useCallback(() => {
    navigate(path);
  }, [navigate, path])

  return (
    <View>
      <TouchableOpacity onPress={navigateTo}> 
        <Text>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### useLocation
Exposes the current location of the router and will update when that location changes:
```tsx
import { useCallback, useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigate, useLocation } from "react-native-routing";
import { Styles } from "./YourStyleSheet"

const MyNavLink = ({ path, label }: { path: string, label: string }) => {
  const navigate = useNavigate();
  const navigateTo = useCallback(() => {
    navigate(path);
  }, [navigate, path]);
  // Active/Inactive link styles
  const location = useLocation();
  const active = useMemo(() => location === path, [path, location]);

  return (
    <View style={active ? Styles.active : Styles.inactive}>
      <TouchableOpacity onPress={navigateTo}> 
        <Text>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### useQueryParams
Often times you'll have routes that require dynamic identifiers such as `/users/:id`. You can use the `useQueryParams` hook to access the object containing the current route's parameters
```tsx
import { View, Text } from "react-native";
import { useQueryParams } from "react-native-routing";

interface Props {
  userID: string;
  users: {
    ID: string;
    name: string;
  }
}

const UserList = ({ userID, users }: Props) => {
  const { id: activeUser } = useQueryParams();
  return (
    <View>
      {
        users.map(user => {
          if(userID === activeUser) {
            return null;
          }
          return (
            <View> 
              <Text>{user.name}</Text>
            </View>
          );
        })
      }
    </View>
  );
}
```

#### useRouteEntrance / useRouteExit
A hook for registering callbacks when your route becomes active/inactive. This hook is useful for running your entrance/exit animations or mounting/unmounting logic for a given screen - especially when caching and recycling your `<Route>`'s Views where your `useEffect()` calls won't be re-initializing.

```tsx
import { useCallback } from "react";
import { Animated, useAnimatedValue } from "react-native";
import { useRouteEntrance, useRouteExit } from "react-native-routing";

export const MyHomeRoute = () => {
  const opacity = useAnimatedValue(0);

  const animate = useCallback((toValue: number) => {
    Animated.timing(opacity, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start()
  })

  useRouteEntrance(() => {
    animate(1);
  });

  useRouteExit(() => {
    animate(0);
  });

  return (
    <Animated.View style={{
      opacity: opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      })
    }}>
      {/* Your Home View */}
    </Animated.View>
  );
}
```
You can also use these callbacks to initialize data fetches or clean up logic relating to your view when it's no longer needed. You may think of them as your `componentDidMount`/`ComponentWillUnmount` lifecycle when caching/prerendering views.

