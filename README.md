# lockingjs

###Description

This library supplies a simple locking mechanism that can be used for resource / action management.

###API Definition
```
	Locking.lock(lockId, [stakeholderName]): boolean
	Locking.unlock(lockId, [stakeholderName]): undefined
	Locking.reset(lockId, [stakeholderName]): undefined

	Locking.isLocked(lockId): boolean

 	Locking.getLockValue(lockId, [stakeholderName]): integer

	Locking.getLockIds(): array[lockIds]

	Locking.getLockMaxValue(lockId): integer
	Locking.setLockMaxValue(lockId, maximumValue): undefined

	Locking.getLockStakeholderMaxValue(lockId): integer
	Locking.setLockStakeholderMaxValue(lockId, maximumValue): undefined
```	
###Rules
1. Locks must each have an id, call the 'lockId'.
2. Each lockId has a value from 0 > infinity. 0 is unlocked, >0 is considered locked.
3. Stakeholder-names can be used to segregate a lockId's value into stakeholder parts  
	such that in 'lockId1', 'stakeholderA' could have 3 locks, and 'stakeholderB' could have 2 locks.  
	in this case, 'lockId1' would have a value of 5.  
4. The default stakeholder name is '_default'.
5. The default maximum lock value per stakeholder is 1 (making the default lock a binary lock).
6. The default maximum overall lock value is infinite.

###Examples

By default, any lockId (with '_default' stakeholder) will be a binary lock, set or unset by any call as such:
```	
	Locking.lock('lockId1');		//lockValue=1
	Locking.unlock('lockId1');		//lockValue=0

	Locking.lock('lockId1');		//lockValue=1
	Locking.lock('lockId1');		//lockValue=1

		//the lockValue would remain at 1 as this is a binary lock (0/1).
```


By default, any lockId with a stakeholderName will be binary per stakeholder:
```
	Locking.lock('lockId1', 'stakeholderA');   	//stakeholderA=1, lockValue=1	
	Locking.lock('lockId1', 'stakeholderB');	//stakeholderA=1, stakeholderB=1, lockValue=2
	Locking.lock('lockId1', 'stakeholderB');	//stakeholderA=1, stakeholderB=1, lockValue=2
		
		//stakeholderB remains at 1 as this is a binary lock (0/1) per stakeholder
	
	Locking.unlock('lockId1', 'stakeholderA');	//stakeholderB=1, lockValue=1
	Locking.unlock('lockId1', 'stakeholderA');	//stakeholderB=1, lockValue=1

		//stakeholderA remains at 1 as this is a binary lock (0/1) per stakeholder.
```


By changing the maximum value of the overall lock, it is possible to lock a finite number of resources
```
	Locking.setLockMaxValue('lockId1', 5);

	Locking.lock('lockId1');		//lockValue=1, returns true
	Locking.lock('lockId1');		//lockValue=2, returns true
	Locking.lock('lockId1');		//lockValue=3, returns true
	Locking.lock('lockId1');		//lockValue=4, returns true
	Locking.lock('lockId1');		//lockValue=5, returns true
	Locking.lock('lockId1');		//lockValue=5, returns false

		//the maximum lock value is reached
```


By changing the maximum value of the stakeholder locks, it is possible to equally limit each stakeholder in an overall resource pool.
```
	Locking.setLockMaxValue('lockId1', 4);
	Locking.setLockStakeholderMaxValue('lockId1', 2);

	Locking.lock('lockId1', 'stakeholderA');		//lockValue=1, returns true
	Locking.lock('lockId1', 'stakeholderB');		//lockValue=2, returns true
	Locking.lock('lockId1', 'stakeholderA');		//lockValue=3, returns true
	Locking.lock('lockId1', 'stakeholderA');		//lockValue=3, returns false

		//stakeholderA has already got 2 locks and so cannot obtain another

	Locking.lock('lockId1', 'stakeholderC');		//lockValue=4, returns true
	Locking.lock('lockId1', 'stakeholderC');		//lockValue=4, returns false

		//the maximum lock value is reached, stakeholderC cannot obtain another lock
```

###Test

See the above examples run in realtime:

https://rawgit.com/cgkineo/lockingjs/master/test/index.html

