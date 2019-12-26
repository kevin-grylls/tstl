//================================================================ 
/** @module std */
//================================================================
import { MultiTreeSet } from "../internal/container/associative/MultiTreeSet";
import { ITreeContainer } from "../internal/container/associative/ITreeContainer";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { SetElementList } from "../internal/container/associative/SetElementList";
import { MultiSetTree } from "../internal/tree/MultiSetTree";

import { Temporary } from "../internal/types/Temporary";

/**
 * Multiple-key Set based on Tree.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class TreeMultiSet<Key>
    extends MultiTreeSet<Key, 
        TreeMultiSet<Key>,
        TreeMultiSet.Iterator<Key>,
        TreeMultiSet.ReverseIterator<Key>>
{
    private tree_!: MultiSetTree<Key, TreeMultiSet<Key>>;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     * 
     * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Note that, because *equality* is predicated by `!comp(x, y) && !comp(y, x)`, the function must not cover the *equality* like `<=` or `>=`. It must exclude the *equality* like `<` or `>`. Default is {@link less}.
     */
    public constructor(comp?: (x: Key, y: Key) => boolean);

    /**
     * Initializer Constructor.
     * 
     * @param items Items to assign.
     * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Note that, because *equality* is predicated by `!comp(x, y) && !comp(y, x)`, the function must not cover the *equality* like `<=` or `>=`. It must exclude the *equality* like `<` or `>`. Default is {@link less}.
     */
    public constructor(items: Key[], comp?: (x: Key, y: Key) => boolean);
    
    /**
     * Copy Constructor.
     * 
     * @param obj Object to copy.
     */
    public constructor(obj: TreeMultiSet<Key>);

    /**
     * Range Constructor.
     * 
     * @param first Input iterator of the first position.
     * @param last Input iterator of the last position.
     * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Note that, because *equality* is predicated by `!comp(x, y) && !comp(y, x)`, the function must not cover the *equality* like `<=` or `>=`. It must exclude the *equality* like `<` or `>`. Default is {@link less}.
     */
    public constructor
    (
        first: Readonly<IForwardIterator<Key>>, 
        last: Readonly<IForwardIterator<Key>>, 
        comp?: (x: Key, y: Key) => boolean
    );

    public constructor(...args: any[])
    {
        super(thisArg => new SetElementList(<Temporary>thisArg) as Temporary);

        ITreeContainer.construct<Key, Key, 
                TreeMultiSet<Key>,
                TreeMultiSet.Iterator<Key>,
                TreeMultiSet.ReverseIterator<Key>,
                Key>
        (
            this, TreeMultiSet, 
            comp => 
            {
                this.tree_ = new MultiSetTree(this as TreeMultiSet<Key>, comp);
            },
            ...args
        );
    }

    /**
     * @inheritDoc
     */
    public clear(): void
    {
        super.clear();

        this.tree_.clear();
    }

    /**
     * @inheritDoc
     */
    public swap(obj: TreeMultiSet<Key>): void
    {
        // SWAP CONTENTS
        [this.data_, obj.data_] = [obj.data_, this.data_];
        SetElementList._Swap_associative(this.data_ as Temporary, obj.data_ as Temporary);

        // SWAP RB-TREE
        MultiSetTree._Swap_source(this.tree_, obj.tree_);
        [this.tree_, obj.tree_] = [obj.tree_, this.tree_];
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public key_comp(): (x: Key, y: Key) => boolean
    {
        return this.tree_.key_comp();
    }

    /**
     * @inheritDoc
     */
    public lower_bound(key: Key): TreeMultiSet.Iterator<Key>
    {
        return this.tree_.lower_bound(key);
    }

    /**
     * @inheritDoc
     */
    public upper_bound(key: Key): TreeMultiSet.Iterator<Key>
    {
        return this.tree_.upper_bound(key);
    }

    /* ---------------------------------------------------------
        POST-PROCESS
    --------------------------------------------------------- */
    protected _Handle_insert(first: TreeMultiSet.Iterator<Key>, last: TreeMultiSet.Iterator<Key>): void
    {
        for (; !first.equals(last); first = first.next())
            this.tree_.insert(first);
    }
    
    protected _Handle_erase(first: TreeMultiSet.Iterator<Key>, last: TreeMultiSet.Iterator<Key>): void
    {
        for (; !first.equals(last); first = first.next())
            this.tree_.erase(first);
    }
}

export namespace TreeMultiSet
{
    // HEAD
    export type Iterator<Key> = SetElementList.Iterator<Key, false, TreeMultiSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, false, TreeMultiSet<Key>>;

    // BODY
    export const Iterator = SetElementList.Iterator;
    export const ReverseIterator = SetElementList.ReverseIterator;
}