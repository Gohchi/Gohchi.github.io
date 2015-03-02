Menu = {}
Menu.__index = Menu

function Menu.new(x, y)
	local mnu = {}             -- our new object
	setmetatable(mnu,Menu)  -- make mnu handle lookup
	mnu.x = (x==nil and 10 or x)	-- x axis
	mnu.y = (y==nil and 10 or y)	-- y axis
	mnu.space = 10					-- spacing
	mnu.selectMode = 1				-- Menu select mode
	mnu.changeMode = 1				--
	mnu.option = 1					-- Selected option
	mnu.DrawOn = SCREEN_UP			-- Screen to draw
	mnu.dir = 0
	mnu.from = 1
	mnu.open = false
	
	local color = {}
	color.base = Color.new(31,31,31)
	color.select = Color.new(0,0,31)
	mnu.color = color
	
	mnu.item = {}
   return mnu
end

function Menu:add(text)
	self.item[#self.item+1] = text
end

function Menu:redefineAxis(x,y)
	self.x = x
	self.y = y
end

function Menu:setSpacing(val)
	self.space = val
end

function Menu:setBaseColor(color)
	self.color.base = color
end

function Menu:setSelectColor(color)
	self.color.select = color
end

function Menu:setSelectMode(Mode)
	if Mode == "Highlight" then
		self.selectMode = 1
	elseif Mode == "Cursor" then
		self.selectMode = 2
	end
end
function Menu:setChangeMode(Mode)
	if Mode == "Stop" then
		self.changeMode = 1
	elseif Mode == "NoStop" then
		self.changeMode = 2
	end
end

function Menu:toBottom()
	self.DrawOn = SCREEN_DOWN
end

function Menu:draw(qRows)
	local spacing = 0
	local color
	local toI
	if self.open then self:_keys() end
	
	if qRows == nil then -- Si no definió filas 
		toI = #self.item -- se el tope es la cantidad de opciones
	else
										-- screen.print(SCREEN_DOWN,100,10, "dir: "..self.dir , Rojo)
		if self.dir == 0 then  ----------------------------------------
		-- Si va hacia arriba
		---------------------------------------------------------------
			if self.from >= self.option then
				self.from = self.option
			end
			if self.from > (#self.item-qRows) then
				self.from = #self.item-qRows+1
			end
			if self.option == #self.item then self.from = #self.item-qRows+1 end 
		else ------------------------------------------------
		-- Si va hacia abajo
		-----------------------------------------------------
			if (self.option - self.from) >= qRows then
				self.from = self.option - qRows + 1
				if self.from < 1 then self.from = 1 end
			end
			if self.option == 1 then self.from = 1 end
		end
		toI = qRows + self.from - 1
		
	end
	
	if self.selectMode == 1 then
		for i=self.from,toI do
			color = (i == self.option and self.color.select or self.color.base)
			screen.print(self.DrawOn,self.x,self.y+spacing,self.item[i], color)
			spacing = spacing + self.space
		end
	else
		local cursor = Image.load("Image/Cursor.png", RAM)
		for i=self.from,toI do
			screen.print(self.DrawOn,self.x,self.y+spacing,self.item[i], self.color.base)
			if i == self.option and self.open then
				screen.blit(self.DrawOn, self.x-13,self.y+spacing-4, cursor)
			end
			spacing = spacing + self.space
		end
	end
-- 	if not self.open then screen.drawFillRect(self.DrawOn,self.x,self.y, self.x+2,self.y+2, Negro) end
end

function Menu:_keys()
	if mnuTimer == nil then mnuTimer = Timer.new() end
	if mnuTimer:getTime() == 0 then mnuTimer:start() end
	if self.limit == nil then self.limit = 0 end
	
 	-- screen.print(SCREEN_DOWN,100,0, (mnuTimer == nil and "true" or "false") , Rojo)
	-- screen.print(SCREEN_DOWN,100,10, (mnuTimer:getTime() == 0 and "true" or "false") , Rojo)
	-- screen.print(SCREEN_DOWN,100,20, mnuTimer:time() , Rojo)
	-- screen.print(SCREEN_DOWN,100,30, self.limit , Rojo)
		
	if mnuTimer:getTime() > 200 then 
		mnuTimer:stop()
		if self.limit > 5 then
			if Keys.held.Down then
				self.option = self.option + 1
				self.dir = 1
			elseif Keys.held.Up then
				self.option = self.option - 1 
				self.dir = 0
			end
			self.limit = nil
		else
			self.limit = self.limit + 1
		end
	else
		if Keys.newPress.Down then
			self.option = self.option + 1 
			self.dir = 1
		elseif Keys.newPress.Up then
			self.option = self.option - 1 
			self.dir = 0
		end
	end
	--screen.print(SCREEN_DOWN,100,50, ((Keys.released.Down and Keys.released.Up) and "true" or "false") , Rojo)
	
	if Keys.released.Down and Keys.released.Up then
		mnuTimer:reset()  -- reseteo el tiempo para que no se duerma zetta
	end 
	if self.option < 1 			then self.option = (self.changeMode == 1 and 1 or #self.item) end
	if self.option > #self.item then self.option = (self.changeMode == 1 and #self.item or 1) end
	
end

function Menu:dropTable()
	self.item = nil
	self.item = {}
end