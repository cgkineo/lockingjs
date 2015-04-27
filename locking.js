(function() {

	/* 	
	*	DESCRIPTION:
	*
	*	This library supplies a simple locking mechanism that can be used for resource / action management.
	*
	*	1. Locks must each have an id, call the 'lockId'.
	*	2. Each lockId has a value from 0 > infinity. 0 is unlocked, >0 is considered locked.
	*	3. Stakeholder-names can be used to segregate a lockId's value into stakeholder parts
	*		such that in 'lockId1', 'stakeholderA' could have 3 locks, and 'stakeholderB' could have 2 locks.
	*		in this case, 'lockId1' would have a value of 5.
	*	4. The default stakeholder name is '_default'.
	*	5. The default maximum lock value per stakeholder is 1 (making the default lock a binary lock).
	*	6. The default maximum overall lock value is infinite.
	*	
	*	EXAMPLES:
	*
	*	By default, any lockId (with '_default' stakeholder) will be a binary lock, set or unset by any call as such:
	*		
	*		Locking.lock('lockId1');		//lockValue=1
	*		Locking.unlock('lockId1');		//lockValue=0
	*
	*		Locking.lock('lockId1');		//lockValue=1
	*		Locking.lock('lockId1');		//lockValue=1
	*
	*			//the lockValue would remain at 1 as this is a binary lock (0/1).
	*
	*
	*
	*	By default, any lockId with a stakeholderName will be binary per stakeholder:
	*
	*		Locking.lock('lockId1', 'stakeholderA');   	//stakeholderA=1, lockValue=1	
	*		Locking.lock('lockId1', 'stakeholderB');	//stakeholderA=1, stakeholderB=1, lockValue=2
	*		Locking.lock('lockId1', 'stakeholderB');	//stakeholderA=1, stakeholderB=1, lockValue=2
	*			
	*			//stakeholderB remains at 1 as this is a binary lock (0/1) per stakeholder
	*		
	*		Locking.unlock('lockId1', 'stakeholderA');	//stakeholderB=1, lockValue=1
	*		Locking.unlock('lockId1', 'stakeholderA');	//stakeholderB=1, lockValue=1
	*
	*			//stakeholderA remains at 1 as this is a binary lock (0/1) per stakeholder.
	*
	*
	*
	*	By changing the maximum value of the overall lock, it is possible to lock a finite number of resources
	*
	*		Locking.setLockMaxValue('lockId1', 5);
	*
	*		Locking.lock('lockId1');		//lockValue=1, returns true
	*		Locking.lock('lockId1');		//lockValue=2, returns true
	*		Locking.lock('lockId1');		//lockValue=3, returns true
	*		Locking.lock('lockId1');		//lockValue=4, returns true
	*		Locking.lock('lockId1');		//lockValue=5, returns true
	*		Locking.lock('lockId1');		//lockValue=5, returns false
	*
	*			//the maximum lock value is reached
	*
	*
	*
	*	By changing the maximum value of the stakeholder locks, it is possible to equally limit each stakeholder in an overall resource pool.
	*
	*		Locking.setLockMaxValue('lockId1', 4);
	*		Locking.setLockStakeholderMaxValue('lockId1', 2);
	*
	*		Locking.lock('lockId1', 'stakeholderA');		//lockValue=1, returns true
	*		Locking.lock('lockId1', 'stakeholderB');		//lockValue=2, returns true
	*		Locking.lock('lockId1', 'stakeholderA');		//lockValue=3, returns true
	*		Locking.lock('lockId1', 'stakeholderA');		//lockValue=3, returns false
	*
	*			//stakeholderA has already got 2 locks and so cannot obtain another
	*
	*		Locking.lock('lockId1', 'stakeholderC');		//lockValue=4, returns true
	*		Locking.lock('lockId1', 'stakeholderC');		//lockValue=4, returns false
	*
	*			//the maximum lock value is reached, stakeholderC cannot obtain another lock
	*
	*
	*	API DEFINITION:
	*
	*		Locking.lock(lockId, [stakeholderName]): boolean
	*		Locking.unlock(lockId, [stakeholderName]): undefined
	*		Locking.reset(lockId, [stakeholderName]): undefined
	*
	*		Locking.isLocked(lockId): boolean
	*
	*	 	Locking.getLockValue(lockId, [stakeholderName]): integer
	*
	*		Locking.getLockIds(): array[lockIds]
	*
	*		Locking.getLockMaxValue(lockId): integer
	*		Locking.setLockMaxValue(lockId, maximumValue): undefined
	*
	*		Locking.getLockStakeholderMaxValue(lockId): integer
	*		Locking.setLockStakeholderMaxValue(lockId, maximumValue): undefined
	*
	*/

	var Locking = window.Locking = {

		_lockOptions: {},
		_locks: {},

		lock: function(lockId, stakeholderName) {
			if (stakeholderName === undefined) stakeholderName = "_default";

			if (typeof lockId != "string" || typeof stakeholderName != "string") throw "Locking: Incorrect lockId or stakeholderName";
			
			if (this._locks[lockId] === undefined) this._locks[lockId] = {};
			if (this._locks[lockId][stakeholderName] === undefined) this._locks[lockId][stakeholderName] = 0;

			var lockIdStakeholderMaxValue = this.getLockStakeholderMaxValue(lockId);
			var lockIdMaxValue = this.getLockMaxValue(lockId);

			var lockIdStakeholderValue = this._locks[lockId][stakeholderName];
			var lockIdValue = this.getLockValue(lockId);

			if (lockIdStakeholderValue == lockIdStakeholderMaxValue && lockIdStakeholderMaxValue > 0) return false;
			if (lockIdValue == lockIdMaxValue && lockIdMaxValue > 0) return false;

			this._locks[lockId][stakeholderName]++;

			return true;
		},

		unlock: function (lockId, stakeholderName) {
			if (stakeholderName === undefined) stakeholderName = "_default";

			if (typeof lockId != "string" || typeof stakeholderName != "string") throw "Locking: Incorrect lockId or stakeholderName";
			
			if (this._locks[lockId] === undefined) return;
			if (this._locks[lockId][stakeholderName] === undefined) return;
  
			this._locks[lockId][stakeholderName]--;

			if (this._locks[lockId][stakeholderName] === 0) delete this._locks[lockId][stakeholderName];
			if (this.getLockValue(lockId) === 0) delete this._locks[lockId];

		},

		reset: function(lockId, stakeholderName) {
			if (stakeholderName === undefined) stakeholderName = "_default";

			if (typeof lockId != "string") throw "Locking: Incorrect lockId";

 			if (this._locks[lockId]) delete this._locks[lockId][stakeholderName];
 			if (this.getLockValue(lockId) === 0) delete this._locks[lockId];
 		
		},

		isLocked: function(lockId) {
			var lockMaxValue = this.getLockMaxValue(lockId);
			var lockValue = this.getLockValue(lockId);

			if (lockMaxValue == -1) return lockValue > 0;
			else return lockValue >= lockMaxValue;

		},

		getLockValue: function(lockId, stakeholderName) {
			if (this._locks[lockId] === undefined) return 0;

			var locks = 0;
			if (stakeholderName !== undefined) {

				locks = this._locks[lockId][stakeholderName] || 0;

			} else {

				for (var k in this._locks[lockId]) {
					locks+=this._locks[lockId][k];
				}

			}

			return locks;
		},

		getLockIds: function() {
			var lockIds = [];
			for (var k in this._locks) {
				lockIds.push(k);
			}
			return lockIds;
		},

		getLockMaxValue: function(lockId) {
			if (this._lockOptions[lockId] === undefined) return -1;
			if (this._lockOptions[lockId].maxValue === undefined) return -1;
			return this._lockOptions[lockId].maxValue;
		},

		setLockMaxValue: function(lockId, maximumValue) {
			if (this._lockOptions[lockId] === undefined) this._lockOptions[lockId] = {};
			this._lockOptions[lockId].maxValue = maximumValue;
		},

		getLockStakeholderMaxValue: function(lockId) {
			if (this._lockOptions[lockId] === undefined) return 1;
			if (this._lockOptions[lockId].maxStakeHolderValue === undefined) return 1;
			return this._lockOptions[lockId].maxStakeHolderValue;
		},

		setLockStakeholderMaxValue: function(lockId, maximumValue) {
			if (this._lockOptions[lockId] === undefined) this._lockOptions[lockId] = {};
			this._lockOptions[lockId].maxStakeHolderValue = maximumValue;
		}

	};


})();






