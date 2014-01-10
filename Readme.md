# Scroll Spy Component

  Listen for scroll events on a window, document, or element and execute callbacks when child elements scroll in or out of view (see `example/example.html`)

## Installation

  Install with [component(1)](http://component.io):

    $ component install ilsken/scrollspy

## API



# ScrollSpy()

@param {HTMLElement} element    
@return {ScrollSpy}     

# exports.prototype.start()

Start listening for scroll events

@return {ScrollySpy}  self for chaining   

# exports.prototype.stop()

Stop listening for scroll events

@return {ScrollSpy}  self for chaining   

# exports.prototype.add()

Add `ScrollHandler` for an element.

@param {HTMLElement} element Element you want to react to scroll events   
@param {Number} topOffset Offset from top to trigger the enter event (default is `0`)   
@param {Number} leftOffset Offset from the left that you wish to trigger the enter event (default is `undefined` (ignore left offset))   
@return {ScrollHandler}  Handler object   

# exports.prototype.remove()

Remove a scroll handler.

You can either pass the `ScrollHandler` returned by `ScrollSpy#add` or an HTMLElement
If you pass an HTML element all listeners for that element will be removed
If you pass a top or left offset, only listeners matching that element and offset will be removed

@param {ScrollHandler|HTMLElement} element Scroll handler to remove or an HTMLElement   
@param {Remove} by topOffset} topOffset Remove by top offset   
@param {Number} leftOffset Remove by left offset   
@return {ScrollSpy}  self for chaining   

# exports.prototype.enter

Set a default enter handler

Called when an element has scrolled into the location specified by either of it's offsets
Must be in the form of `function handler(is_at_top_offset, is_at_left_offset)`. 

@param {Function} handler    
@return {ScrollSpy}  self for chaining   

# exports.prototype.leave

Set a default leave handler

Called when an element has left the location specified by either of it's offsets
Must be in the form of `function handler(is_at_top_offset, is_at_left_offset)`. 

@param {Function} handler    
@return {ScrollSpy}  self for chaining   

# ScrollHandler()

ScrollHandler

@param {ScrollSpy} spy    
@param {HTMLElement} element    
@param {Number} topOffset    
@param {Number} leftOffset    

# ScrollHandler.prototype.offset()

Gets or sets the offset for this handler

@param {Number} topOffset    
@param {Number} leftOffset    
@return {ScrollHandler}  self for chaining   

# ScrollHandler.prototype.end()

Gets the parent `ScrollSpy` instance

@return {ScrollSpy}  parent `ScrollSpy` instance   

# Handler.prototype.enter

Set the enter handler

Called when an element has scrolled into the location specified by either of it's offsets
Must be in the form of `function handler(is_at_top_offset, is_at_left_offset)`. 

@param {Function} handler    
@return {ScrollSpy}  self for chaining   

# ScrollHandler.prototype.leave

Set the leave handler

Called when an element has left the location specified by either of it's offsets
Must be in the form of `function handler(is_at_top_offset, is_at_left_offset)`. 

@param {Function} handler    
@return {ScrollSpy}  self for chaining   


## License

  MIT
