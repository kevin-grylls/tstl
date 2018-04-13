﻿/// <reference path="API.ts" />

/// <reference path="iterators/InsertIterator.ts" />
/// <reference path="iterators/FrontInsertIterator.ts" />
/// <reference path="iterators/BackInsertIterator.ts" />
/// <reference path="iterators/JSArrayIterator.ts" />

// <iterator>
//
// @reference http://www.cplusplus.com/reference/iterator
// @author Jeongho Nam <http://samchon.org>

namespace std
{
	/* =========================================================
		GLOBAL FUNCTIONS
			- ACCESSORS
			- MOVERS
			- FACTORIES
	============================================================
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * Test whether a container is empty.
	 * 
	 * @param source Target container.
	 * @return Whether empty or not.
	 */
	export function empty(source: base._IEmpty): boolean;

	/**
	 * @hidden
	 */
	export function empty<T>(source: Array<T>): boolean;
	export function empty(source: any): boolean
	{
		if (source instanceof Array)
			return source.length !== 0;
		else
			return source.empty();
	}

	/**
	 * Get number of elements of a container.
	 * 
	 * @param source Target container.
	 * @return The number of elements in the container.
	 */
	export function size(source: base._ISize): number

	/**
	 * @hidden
	 */
	export function size<T>(source: Array<T>): number;
	export function size(source: any): number
	{
		if (source instanceof Array)
			return source.length;
		else
			return source.size();
	}

	/**
	 * Get distance between two iterators.
	 * 
	 * @param first Input iteartor of the first position.
	 * @param last Input iterator of the last position.
	 * 
	 * @return The distance.
	 */
	export function distance<T, InputIterator extends IForwardIterator<T, InputIterator>>
		(first: InputIterator, last: InputIterator): number
	{
		if ((<any>first).index !== undefined)
			return _Distance_via_index(<any>first, <any>last);

		let length: number = 0;
		for (; !first.equals(last); first = first.next())
			length++;

		return length;
	}

	/**
	 * @hidden
	 */
	function _Distance_via_index<T, RandomAccessIterator extends IRandomAccessIterator<T, RandomAccessIterator>>
		(first: RandomAccessIterator, last: RandomAccessIterator): number
	{
		let start: number = first.index();
		let end: number = last.index();

		return Math.abs(end - start);
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * Advance iterator.
	 * 
	 * @param it Target iterator to advance.
	 * @param n Step to advance.
	 * 
	 * @return The advanced iterator.
	 */
	export function advance<T, InputIterator extends IForwardIterator<T, InputIterator>>
		(it: InputIterator, n: number): InputIterator
	{
		if ((<any>it).advance instanceof Function)
			it = (<any>it).advance(n);
		else if (n > 0)
			for (let i: number = 0; i < n; ++i)
				it = it.next();
		else
		{
			let p_it: IBidirectionalIterator<T, any> = <any>it;
			if (!(p_it.next instanceof Function))
				throw new std.OutOfRange("It's not bidirectional iterator. Advancing to negative value is impossible.");

			n = -n;
			for (let i: number = 0; i < n; ++i)
				p_it = p_it.prev();

			it = <any>p_it;
		}
		return it;
	}
	
	/**
	 * Get previous iterator.
	 * 
	 * @param it Iterator to move.
	 * @param n Step to move prev.
	 * @return An iterator moved to prev *n* steps.
	 */
	export function prev<T, BidirectionalIterator extends IBidirectionalIterator<T, BidirectionalIterator>>
		(it: BidirectionalIterator, n: number = 1): BidirectionalIterator
	{
		if (n === 1)
			return it.prev();
		else
			return advance(it, -n);
	}
	
	/**
	 * Get next iterator.
	 * 
	 * @param it Iterator to move.
	 * @param n Step to move next.
	 * @return Iterator moved to next *n* steps.
	 */
	export function next<T, ForwardIterator extends IForwardIterator<T, ForwardIterator>>
		(it: ForwardIterator, n: number = 1): ForwardIterator
	{	
		if (n === 1)
			return it.next();
		else
			return advance(it, n);
	}

	/* ---------------------------------------------------------
		FACTORIES
	--------------------------------------------------------- */
	// BEGIN & END
	//----
	/**
	 * Iterator to the first element.
	 * 
	 * @param container Target container.
	 * @return Iterator to the first element.
	 */
	export function begin<T, Iterator extends IForwardIterator<T, Iterator>>
		(container: base.IForwardContainer<T, Iterator>): Iterator;

	/**
	 * @hidden
	 */
	export function begin<T>(container: Array<T>): Vector.Iterator<T>;
	export function begin(container: any): any
	{
		if (container instanceof Array)
			container = _Capsule(container);
		
		return container.begin();
	}
	
	/**
	 * Iterator to the end.
	 * 
	 * @param container Target container.
	 * @return Iterator to the end.
	 */
	export function end<T, Iterator extends IForwardIterator<T, Iterator>>
		(container: base.IForwardContainer<T, Iterator>): Iterator;

	/**
	 * @hidden
	 */
	export function end<T>(container: Array<T>): Vector.Iterator<T>;
	export function end(container: any): any
	{
		if (container instanceof Array)
			container = _Capsule(container);
		
		return container.end();
	}

	//----
	// INSERTERS
	//----
	/**
	 * Construct insert iterator.
	 * 
	 * @param container Target container.
	 * @param it Iterator to the first insertion position.
	 * @return The {@link InsertIterator insert iterator} object.
	 */
	export function inserter<T, Container extends base._IInsert<T, Iterator>, Iterator extends IForwardIterator<T, Iterator>>
		(container: Container, it: Iterator): InsertIterator<T, Container, Iterator>;

	/**
	 * @hidden
	 */
	export function inserter<T>
		(container: Array<T>, it: Vector.Iterator<T>): InsertIterator<T, Vector<T>, Vector.Iterator<T>>;

	export function inserter<T>
		(container: Array<T> | base._IInsert<T, any>, it: IForwardIterator<T, any>): InsertIterator<T, any, any>
	{
		if (container instanceof Array)
			container = _Capsule(container);
		
		return new InsertIterator(<any>container, it);
	}

	/**
	 * Construct front insert iterator.
	 * 
	 * @param source Target container.
	 * @return The {@link FrontInsertIterator front insert iterator} object.
	 */
	export function front_inserter<T, Source extends base._IPushFront<T>>
		(source: Source): FrontInsertIterator<T, Source>
	{
		return new FrontInsertIterator(source);
	}

	/**
	 * Construct back insert iterator.
	 * 
	 * @param source Target container.
	 * @return The {@link back insert iterator} object.
	 */
	export function back_inserter<T, Source extends base._IPushBack<T>>
		(source: Source): BackInsertIterator<T, Source>

	/**
	 * @hidden
	 */
	export function back_inserter<T>
		(source: Array<T>): BackInsertIterator<T, Vector<T>>;

	export function back_inserter<T>
		(source: Array<T> | base._IPushBack<T>): BackInsertIterator<T, any>
	{
		if (source instanceof Array)
			source = _Capsule(source);

		return new BackInsertIterator(<any>source);
	}

	//----
	// REVERSE ITERATORS
	//----
	/**
	 * Construct reverse iterator.
	 * 
	 * @param it Target iterator that reversable.
	 * @return The reverse iterator object.
	 */
	export function make_reverse_iterator<T, 
			IteratorT extends IReversableIterator<T, IteratorT, ReverseT>, 
			ReverseT extends IReverseIterator<T, IteratorT, ReverseT>>
		(it: IteratorT): ReverseT
	{
		return it.reverse();
	}

	/**
	 * Get reverse iterator to the first element in reverse.
	 * 
	 * @param container Target container.
	 * @return The reverse iterator to the first.
	 */
	export function rbegin<T, 
		Iterator extends IReversableIterator<T, Iterator, ReverseIterator>,
		ReverseIterator extends IReverseIterator<T, Iterator, ReverseIterator>>
		(container: base.IBidirectionalContainer<T, Iterator, ReverseIterator>): ReverseIterator;

	/**
	 * @hidden
	 */
	export function rbegin<T>(container: Array<T>): Vector.ReverseIterator<T>;
	export function rbegin(source: any): any
	{
		if (source instanceof Array)
			source = _Capsule(source);

		source.rbegin();
	}

	/**
	 * Get reverse iterator to the reverse end.
	 * 
	 * @param container Target container.
	 * @return The reverse iterator to the end.
	 */
	export function rend<T,
		Iterator extends IReversableIterator<T, Iterator, ReverseIterator>,
		ReverseIterator extends IReverseIterator<T, Iterator, ReverseIterator>>
		(container: base.IBidirectionalContainer<T, Iterator, ReverseIterator>): ReverseIterator;

	/**
	 * @hidden
	 */
	export function rend<T>(container: Array<T>): Vector.ReverseIterator<T>;
	export function rend(source: any): any
	{
		if (source instanceof Array)
			source = _Capsule(source);

		source.rend();
	}

	/**
	 * @hidden
	 */
	function _Capsule<T>(array: Array<T>): Vector<T>
	{
		let ret: Vector<T> = new Vector();
		ret["data_"] = array;

		return ret;
	}
}