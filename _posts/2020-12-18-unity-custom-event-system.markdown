---
layout: post
title:  "A surprisingly simple custom Unity event system"
date:   2020-12-18 16:10:05 +0000
---

I was surprised and annoyed to find that you can't add your own event interfaces, like IPointerClickHandler and just have them work.

Instead, I made something like this, which appears to work. At least immediately. Maybe there are issues in this.

```
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;

public class InterfaceMethodStruct
{
    public System.Type type;
    public string methodName;
}

public class EventSubscriptions : MonoBehaviour
{
    private Dictionary<string, InterfaceMethodStruct> eventNameInterfaceMap = new Dictionary<string, InterfaceMethodStruct> {
        { "PlayerMoved", new InterfaceMethodStruct { type = typeof(IPlayerMoved), methodName = "OnPlayerMove" } },
    };

    public GameObject[] listeners;

    public void PlayerMoved()
    {
        Trigger("PlayerMoved");
    }

    private void Trigger(string name)
    {
        List<MonoBehaviour> triggered = new List<MonoBehaviour>();
        foreach (GameObject listener in listeners) {
            foreach (MonoBehaviour component in listener.GetComponentsInChildren(eventNameInterfaceMap[name].type)) {
                triggered.Add(component);
            }
        }
        
        foreach(var trigger in triggered) {
            MethodInfo method = eventNameInterfaceMap[name].type.GetMethod(eventNameInterfaceMap[name].methodName);
            method.Invoke(trigger, new object[0]);
        }
    }
}
```

* Tell it which GameObjects might be listening for events. This is an optimisation, so that you don't have to loop through every GameObject.
* Create your static Dictionary of event names, mapped with the interface and method that should be triggered when fired.
* Call Trigger.

Trigger just:

* Looks across the listeners for components with this interface.
* Call the method on each of them.

Cons, which I don't care about right now:

* Can't pass arguments. (I just need a messaging system to say "hey, time to resync".)
* "Registering" event types is very manually. (Fine, I know the entire scope of the application.)

Anyway, works for me.
