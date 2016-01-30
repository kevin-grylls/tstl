﻿/// <reference path="base/UniqueSet.ts" />

/// <reference path="base/Hash.ts" />

namespace std
{
    /**
     * <p> Unordered Set, in other other, Hash Set. </p>
     *
     * <p> Unordered sets are containers that store unique elements in no particular order, and which allow for 
     * fast retrieval of individual elements based on their value. </p>
     *
     * <p> In an <code>UnorderedSet</code>, the value of an element is at the same time its key, that identifies 
     * it uniquely. Keys are immutable, therefore, the elements in an <code>UnorderedSet</code> cannot be modified 
     * once in the container - they can be inserted and removed, though. </p>
     *
     * <p> Internally, the elements in the <code>UnorderedSet</code> are not sorted in any particular order, but 
     * organized into buckets depending on their hash values to allow for fast access to individual elements directly 
     * by their values (with a constant average time complexity on average). </p>
     *
     * <p> <code>UnorderedSet</code> containers are faster than <codeSet<code> containers to access individual 
     * elements by their key, although they are generally less efficient for range iteration through a subset of 
     * their elements. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference: http://www.cplusplus.com/reference/unordered_set/unordered_set/ </li>
     * </ul>
     *
     * @param <T> Type of the elements. 
     *			  Each element in an <code>UnorderedSet</code> is also uniquely identified by this value.
     *
     * @author Migrated by Jeongho Nam
     */
    export class UnorderedSet<T>
        extends base.UniqueSet<T>
    {
        private hashBucket: base.HashBucket<SetIterator<T>>;

        /* =========================================================
		    CONSTRUCTORS & SEMI-CONSTRUCTORS
                - CONSTRUCTORS
                - ASSIGN & CLEAR
	    ============================================================
            CONSTURCTORS
        --------------------------------------------------------- */
        /**
         * Default Constructor.
         */
        public constructor();

        /**
         * Construct from elements.
         */
        public constructor(items: Array<T>);

        /**
         * Copy Constructor.
         */
        public constructor(container: base.IContainer<T>);

        /**
         * Construct from range iterators.
         */
        public constructor(begin: Iterator<T>, end: Iterator<T>);

        public constructor(...args: any[])
        {
			super();

			// BUCKET
            this.hashBucket = new base.HashBucket<SetIterator<T>>();

            // OVERLOADINGS
            if (args.length == 1 && args[0] instanceof Array && args[0] instanceof Vector == false)
            {
                this.constructByArray(args[0]);
            }
            else if (args.length == 1 && args[0] instanceof base.Container)
            {
                this.constructByContainer(args[0]);
            }
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
            {
                this.constructByRange(args[0], args[1]);
            }
        }
        
        protected constructByArray(items: Array<T>): void
        {
            this.hashBucket.reserve(items.length * base.Hash.RATIO);

            super.constructByArray(items);
        }

        /* ---------------------------------------------------------
		    ASSIGN & CLEAR
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public assign<U extends T>(begin: Iterator<U>, end: Iterator<U>): void
        {
            var it: Iterator<U>;
            var size: number = 0;
            
            // RESERVE HASH_BUCKET SIZE
            for (it = begin; it.equals(end) == false; it = it.next())
                size++;

			this.hashBucket.clear();
            this.hashBucket.reserve(size * base.Hash.RATIO);

            // SUPER; INSERT
            super.assign(begin, end);
        }

        /**
         * @inheritdoc
         */
        public clear(): void
        {
            super.clear();

            this.hashBucket.clear();
        }

        /* =========================================================
		    ACCESSORS
	    ========================================================= */
        /**
         * @inheritdoc
         */
        public find(val: T): Iterator<T>
        {
            var hashIndex: number = base.Hash.code(val) % this.hashBucket.size();
            var hashArray = this.hashBucket.at(hashIndex);

            for (var i: number = 0; i < hashArray.size(); i++)
                if (std.equals(hashArray.at(i).value, val))
                    return hashArray.at(i);

            return this.end();
        }
        
        /* =========================================================
		    ELEMENTS I/O
                - INSERT
                - POST-PROCESS
	    ============================================================
		    INSERT
	    --------------------------------------------------------- */
		protected insertByVal(val: T): any
		{
			// TEST WHETHER EXIST
            var it = this.find(val);
            if (it.equals(this.end()) == false)
                return new Pair<Iterator<T>, boolean>(it, false);

            // INSERT
            this.data.pushBack(val);
            it = it.prev();

            // POST-PROCESS
            this.handleInsert(<SetIterator<T>>it);

            return new Pair<Iterator<T>, boolean>(it, true);
		}

        protected insertByRange(begin: Iterator<T>, end: Iterator<T>): void
        {
            // CALCULATE INSERTING SIZE
            var size: number = 0;
            for (var it = begin; it.equals(end) == false; it = it.next())
                size++;

            // IF NEEDED, HASH_BUCKET TO HAVE SUITABLE SIZE
            if (this.size() + size > this.hashBucket.itemSize() * base.Hash.MAX_RATIO)
                this.hashBucket.reserve((this.size() + size) * base.Hash.RATIO);

            // INSERTS
            super.insertByRange(begin, end);
        }

        /* ---------------------------------------------------------
		    POST-PROCESS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        protected handleInsert(item: SetIterator<T>): void
        {
            this.hashBucket.insert(item);
        }

        /**
         * @inheritdoc
         */
        protected handleErase(item: SetIterator<T>): void
        {
            this.hashBucket.erase(item);
        }
    }
}