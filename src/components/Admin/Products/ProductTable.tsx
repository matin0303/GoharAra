
'use client';

import * as React from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	TableSortLabel,
	Paper,
	IconButton,
} from '@mui/material';
import { Product } from '@/types/api.types';
import { Edit, Eye, PhoneIcon, Trash } from 'lucide-react';
import { toJalaliDateTime } from '@/lib/utils';
import Link from 'next/link';



interface ProductTableProps {
	rows: Product[];
	setOpenDeleteModal:(id:number) => void ;
	setOpenEditModal: (id:number) => void;
}

type Order = 'asc' | 'desc';
type OrderBy = 'price' | 'title' | 'created_at';

export default function ProductTable({ rows, setOpenDeleteModal, setOpenEditModal }: ProductTableProps) {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<OrderBy>('created_at');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const getImage1 = (images:string)=>{
		const image = JSON.parse(images)
		return image[0]
	}
	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: OrderBy
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const getValue = (row: Product, key: OrderBy): number | string => {
		switch (key) {
			case 'price':
				return row.price;
			case 'title':
				return row.title;
			case 'created_at':
				return row.created_at ?? '';
			default:
				return '';
		}
	};

	function descendingComparator(a: Product, b: Product, orderBy: OrderBy) {
		const aValue = getValue(a, orderBy);
		const bValue = getValue(b, orderBy);
		if (bValue < aValue) return -1;
		if (bValue > aValue) return 1;
		return 0;
	}

	function getComparator(order: Order, orderBy: OrderBy) {
		return order === 'desc'
			? (a: Product, b: Product) => descendingComparator(a, b, orderBy)
			: (a: Product, b: Product) => -descendingComparator(a, b, orderBy);
	}

	const sortedRows = React.useMemo(() => {
		const comparator: (a: Product, b: Product) => number = getComparator(order, orderBy);
		return [...rows]
			.sort((a: Product, b: Product) => comparator(a, b))
			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
	}, [rows, order, orderBy, page, rowsPerPage]);

	const headCells = [
		{ id: 'actions', label: 'عملیات', numeric: false },
		{ id: 'created_at', label: 'تاریخ ثبت', numeric: true },
		{ id: 'price', label: 'قیمت ', numeric: true },
		{ id: 'title', label: 'نام محصول', numeric: false },
		{ id: 'image', label: 'تصویر', numeric: false },

	];

	return (
		<Box sx={{ width: '100%', fontFamily: 'kalameh !important', fontWeight: 'bold' }} className="text-foreground">
			<Paper sx={{ width: '100%', boxShadow: 'none' }} className="bg-card text-foreground">
				<TableContainer>
					<Table sx={{ width: '100%', minWidth: 500, tableLayout: 'auto' }}>
						<TableHead>
							<TableRow>
								{headCells.map((headCell) => (
									<TableCell
										key={headCell.id}
										align="center"
										sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}
										className="text-foreground"
									>
										{headCell.id !== 'actions' ? (
											<TableSortLabel
												active={orderBy === headCell.id}
												direction={orderBy === headCell.id ? order : 'asc'}
												onClick={(e) => handleRequestSort(e, headCell.id as OrderBy)}
											>
												{headCell.label}
											</TableSortLabel>
										) : (
											headCell.label
										)}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{sortedRows.map((row) => (
								<TableRow hover key={row.id} className="text-foreground"  >
									<TableCell align="center">

										<IconButton onClick={() => { setOpenDeleteModal(row.id) }}>
											<Trash className="text-red-600" />
										</IconButton>


										<Link href={`/products/${row.id}`}>
											<IconButton >
												<Eye className="text-blue-600" />
											</IconButton>
										</Link>

										<IconButton onClick={() => {setOpenEditModal(row.id) }}>
											<Edit className="text-orange-400" />
										</IconButton>

									</TableCell>
									<TableCell align="center" className="text-foreground" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}>{toJalaliDateTime(row.updated_at)}</TableCell>
									<TableCell align="center" className="text-foreground" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}>{(row.price).toLocaleString()} تومان</TableCell>
									<TableCell align="center" className="text-foreground" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}>{row.title}</TableCell>
									<TableCell align="center" className="text-foreground max-w-10 max-lg:min-w-50" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}><img src={getImage1(row.images)} alt='تصویر محصول' className='rounded-sm aspect-video object-cover h-20 '/></TableCell>

								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					className="text-foreground"
				/>
			</Paper>
		</Box>
	);
}
