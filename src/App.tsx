import {
	Card,
	CardBody,
	Container,
	Heading,
	Center,
	Image,
	Stack,
	Text,
	SimpleGrid,
	Badge,
	Flex,
	Tag,
	Button,
	Box,
	Select,
	Skeleton,
	Alert,
	AlertTitle,
	AlertDescription,
	AlertIcon,
} from '@chakra-ui/react'
import './App.css'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function App() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const NO_PER_PAGE = Number(searchParams.get('noPerPage')) || 10

	const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
	const [noPerPage, setNoPerpage] = useState(NO_PER_PAGE)

	// const [headers, setHeaders] = useState()
	const fetchData = async (data: any) => {
		const page = data.queryKey[1]
		const perPage = data.queryKey[2]
		return fetch(
			`https://api.punkapi.com/v2/beers?page=${page}&per_page=${perPage}`,
		).then((res) => res.json())
	}

	const { status, data } = useQuery<any, Error>(
		['data', page, noPerPage],
		fetchData,
		{ keepPreviousData: true },
	)

	const handlePageChange = (newPage: number) => {
		navigate(`?page=${newPage}&noPerPage=${noPerPage}`)
		setPage(newPage)
	}

	const handlePageCount = (noPerPage: number) => {
		navigate(`?page=${page}&noPerPage=${noPerPage}`)
		setNoPerpage(noPerPage)
	}

	return (
		<Container maxW='6xl'>
			<Center>
				<Heading my='20'>Primal Journal Test</Heading>
			</Center>
			{status === 'loading' ? (
				<Stack>
					<Skeleton height='200px' />
					<Skeleton height='40px' />
					<Skeleton height='80px' />
				</Stack>
			) : data.length === 0 ? (
				<Alert status='warning'>
					<AlertIcon />
					<AlertTitle>Too many!</AlertTitle>
					<AlertDescription>
						This Api doesn't have this length of Data
					</AlertDescription>
				</Alert>
			) : NO_PER_PAGE > 80 || data.statusCode === 400 ? (
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>Error fetching data!</AlertTitle>
					<AlertDescription>{data.message}</AlertDescription>
				</Alert>
			) : (
				<>
					<SimpleGrid columns={3} spacing={10}>
						{data.map((data: any) => (
							<Card maxW='sm' key={data.id}>
								<Tag>{data.id}</Tag>
								<CardBody>
									<Image
										width='100%'
										height='200'
										fit='contain'
										src={data.image_url}
										borderRadius='lg'
									/>
									<Stack mt='6' spacing='3'>
										<Flex alignItems={'center'} justifyContent='space-between'>
											<Heading size='md'>{data.name}</Heading>
											<Text ml='10' fontSize={'xs'}>
												{data.first_brewed}
											</Text>
										</Flex>
										<Badge ml='2'>{data.tagline}</Badge>
										<Text noOfLines={4}>{data.description}</Text>
										{/* <Text color='blue.600' fontSize='2xl'>
										$450
									</Text> */}
									</Stack>
								</CardBody>
							</Card>
						))}
					</SimpleGrid>
					<Flex justifyContent={'space-between'} my='20'>
						<Select
							w='20'
							onChange={(e) => handlePageCount(+e.target.value)}
							defaultValue={noPerPage}
							placeholder=''>
							<option value='10'>10</option>
							<option value='20'>20</option>
							<option value='40'>40</option>
							<option value='80'>80</option>
						</Select>
						<Box>
							<Button
								onClick={() => handlePageChange(page - 1)}
								isDisabled={page === 1}>
								Prev
							</Button>
							<Button ml='2' onClick={() => handlePageChange(page + 1)}>
								Next
							</Button>
						</Box>
					</Flex>
				</>
			)}
		</Container>
	)
}

export default App
